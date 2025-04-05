import React, { createContext, useContext, useState, useEffect } from 'react';
import Groq from 'groq-sdk';
import { initializeVectorStore, queryVectorStore } from '@/utils/documentProcessing';

interface ChatHistory {
  id: string;
  title: string;
  messages: Array<{
    id: number;
    content: string;
    sender: 'user' | 'assistant';
  }>;
  destination?: string;
  createdAt: Date;
}

interface DestinationInfo {
  description: string;
  thingsToDo: string[];
  bestTimeToVisit: string;
  averageCosts: {
    accommodation: string;
    food: string;
    activities: string;
  };
  tips: string[];
}

interface TripPlanningContextType {
  budget: number[];
  setBudget: (budget: number[]) => void;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  selectedPreferences: string[];
  setSelectedPreferences: (preferences: string[]) => void;
  itinerary: Array<{
    day: number;
    activities: string[];
  }>;
  setItinerary: (itinerary: Array<{ day: number; activities: string[] }>) => void;
  destination: string;
  setDestination: (destination: string) => void;
  chatHistory: ChatHistory[];
  setChatHistory: (history: ChatHistory[]) => void;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  startNewChat: () => void;
  updateCurrentChat: (messages: Array<{ id: number; content: string; sender: 'user' | 'assistant' }>) => void;
  loadChatSession: (chatId: string) => void;
  destinationInfo: DestinationInfo | null;
  searchDestination: (destination: string) => Promise<void>;
}

const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

// Helper function to extract itinerary from a message
const extractItineraryFromMessage = (content: string) => {
  try {
    // Look for day-by-day sections with a more flexible pattern
    const dayMatches = content.match(/Day\s*\d+[:\s-]+[\s\S]*?(?=Day\s*\d+[:\s-]+|$)/g);
    
    if (!dayMatches) return null;
    
    return dayMatches.map(dayText => {
      // Extract day number
      const dayNum = dayText.match(/Day\s*(\d+)/)?.[1];
      if (!dayNum) return null;
      
      // Clean up activities
      const activities = dayText
        .replace(/Day\s*\d+[:\s-]+/, '') // Remove day header
        .split('\n')
        .map(line => line.trim())
        .filter(line => 
          line && 
          !line.match(/^Day\s*\d+/) && // Skip any nested day headers
          !line.match(/^\*\*.*\*\*$/) && // Skip bold markers
          !line.match(/^\*$/) // Skip single asterisks
        )
        .map(activity => 
          activity
            .replace(/^[•\-\*]\s*/, '') // Remove bullet points
            .replace(/\*\*/g, '') // Remove bold markers
            .trim()
        );
      
      return {
        day: parseInt(dayNum),
        activities: activities.filter(Boolean) // Remove any empty strings
      };
    }).filter(Boolean) // Remove any null entries
    .sort((a, b) => a.day - b.day); // Sort by day number
  } catch (error) {
    console.error('Error extracting itinerary:', error);
    return null;
  }
};

const extractDestinationAndOrigin = (message: string) => {
  // Match "from X to Y" pattern
  const fromToMatch = message.match(/(?:from|in)\s+([A-Za-z\s,]+)\s+to\s+([A-Za-z\s,]+)/i);
  if (fromToMatch) {
    return {
      origin: fromToMatch[1].trim(),
      destination: fromToMatch[2].trim()
    };
  }

  // Match destination only pattern
  const destinationMatch = message.match(/(?:to|in|at|visit|going to)\s+([A-Za-z\s,]+)(?:\s+from|for|in|on|during|\.|\?|$)/i);
  if (destinationMatch) {
    return {
      destination: destinationMatch[1].trim()
    };
  }

  return null;
};

export function TripPlanningProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudget] = useState<number[]>([1500]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<Array<{ day: number; activities: string[] }>>([]);
  const [destination, setDestination] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Convert string dates back to Date objects
      const historyWithDates = parsed.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt)
      }));
      setChatHistory(historyWithDates);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Update chat title when destination changes
  useEffect(() => {
    if (currentChatId && destination) {
      setChatHistory(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            title: `Trip to ${destination}`,
            destination
          };
        }
        return chat;
      }));
    }
  }, [destination, currentChatId]);

  // Initialize vector store when the provider mounts
  useEffect(() => {
    const initVectorStore = async () => {
      const initialized = await initializeVectorStore();
      if (!initialized) {
        console.error("Failed to initialize vector store");
      } else {
        console.log("Vector store initialized successfully");
      }
    };
    initVectorStore();
  }, []);

  const startNewChat = () => {
    const newChatId = crypto.randomUUID();
    const newChat: ChatHistory = {
      id: newChatId,
      title: 'New Chat',
      messages: [{
        id: 1,
        content: "Hello! I'm JourneyGenie, your AI travel assistant. How can I help plan your next adventure?",
        sender: 'assistant'
      }],
      createdAt: new Date()
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setDestination('');
    setItinerary([]);
  };

  const processAIResponse = async (userMessage: string) => {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      console.error('Groq API key not found');
      return "I apologize, but I'm not properly configured. Please make sure the API key is set up correctly.";
    }

    const groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });

    try {
      // First check for destination in user message
      const locationInfo = extractDestinationAndOrigin(userMessage);
      
      // Get relevant travel guide information
      const guideResults = await queryVectorStore(userMessage, 3);
      let travelGuideContext = "";
      
      if (guideResults && guideResults.length > 0) {
        travelGuideContext = guideResults.map(result => 
          `From ${result.source} (Page ${result.page}):\n${result.content}`
        ).join('\n\n');
      }

      // Update destination if found in message
      if (locationInfo?.destination && locationInfo.destination !== destination) {
        setDestination(locationInfo.destination);
        await searchDestination(locationInfo.destination);
      }

      // Construct prompt with all available context
      let contextPrompt = `You are JourneyGenie, an AI travel assistant. Use the following information to help answer the user's question:

Travel Guide Information:
${travelGuideContext}

${destinationInfo ? `Destination Information:
${JSON.stringify(destinationInfo, null, 2)}` : ''}

${itinerary.length > 0 ? `Current Itinerary:
${JSON.stringify(itinerary, null, 2)}` : ''}

User Message: ${userMessage}

Instructions:
1. Use specific information from the travel guides when available
2. Include exact quotes from the guides when relevant
3. If suggesting attractions or activities, prioritize ones mentioned in the guides
4. When creating an itinerary:
   - Format each day header exactly as "Day X:" (no bold markers or extra spaces)
   - List activities on new lines without bold markers or asterisks
   - Keep activities clear and concise
   - Include key details like costs, timings, and tips within the activity description
5. If the user asks about costs or logistics, use the real data from destinationInfo
6. Avoid using markdown formatting like ** or * in responses`;

      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: contextPrompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return "I apologize, but I couldn't generate a response. Would you like to try asking in a different way?";
      }

      // Try to extract and update itinerary if response contains day-by-day plans
      const extractedItinerary = extractItineraryFromMessage(content);
      if (extractedItinerary && extractedItinerary.length > 0) {
        setItinerary(extractedItinerary);
      }

      return content;

    } catch (error) {
      console.error('Error processing AI response:', error);
      return "I apologize, but I encountered an error processing your request. Please try again.";
    }
  };

  const updateCurrentChat = async (messages: Array<{ id: number; content: string; sender: 'user' | 'assistant' }>) => {
    if (!currentChatId) return;

    // If this is a new user message, generate AI response
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      const aiResponse = await processAIResponse(lastMessage.content);
      
      // Add AI response to messages
      messages.push({
        id: messages.length + 1,
        content: aiResponse,
        sender: 'assistant'
      });
    }

    // Update chat history
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages,
          destination: destination || chat.destination,
          title: chat.title === 'New Chat' && destination ? `Trip to ${destination}` : chat.title
        };
      }
      return chat;
    }));
  };

  const loadChatSession = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      // First set currentChatId and destination
      setCurrentChatId(chatId);
      setDestination(chat.destination || '');
      
      // Then try to extract itinerary from chat messages
      if (chat.messages && chat.messages.length > 0) {
        // Look for messages from assistant that might contain itinerary
        for (let i = chat.messages.length - 1; i >= 0; i--) {
          const message = chat.messages[i];
          if (message.sender === 'assistant' && message.content.includes('Day')) {
            const extractedItinerary = extractItineraryFromMessage(message.content);
            if (extractedItinerary && extractedItinerary.length > 0) {
              setItinerary(extractedItinerary);
              break;
            }
          }
        }
      }
    }
  };

  const searchDestination = async (destination: string) => {
    try {
      const groq = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      // First try to get travel info from search
      const searchPrompt = `Give me comprehensive travel information about ${destination}. Include details about:
      1. Brief description
      2. Top things to do and attractions
      3. Best time to visit
      4. Average costs for accommodation, food, and activities
      5. Local travel tips

      Return ONLY a JSON object in this exact format (no other text):
      {
        "description": "brief overview of the destination",
        "thingsToDo": ["array of top attractions and activities"],
        "bestTimeToVisit": "best season or months to visit",
        "averageCosts": {
          "accommodation": "average hotel/hostel costs per night",
          "food": "average meal costs",
          "activities": "average activity/attraction costs"
        },
        "tips": ["array of useful travel tips"]
      }`;

      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: searchPrompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 1024,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from search');

      try {
        const info = JSON.parse(content);
        setDestinationInfo(info);
        console.log('Destination info loaded:', info);
      } catch (e) {
        console.error('Error parsing destination info:', e);
      }

    } catch (error) {
      console.error('Error searching destination:', error);
      setDestinationInfo(null);
    }
  };

  const value = {
    budget,
    setBudget,
    selectedDates,
    setSelectedDates,
    selectedPreferences,
    setSelectedPreferences,
    itinerary,
    setItinerary,
    destination,
    setDestination,
    chatHistory,
    setChatHistory,
    currentChatId,
    setCurrentChatId,
    startNewChat,
    updateCurrentChat,
    loadChatSession,
    destinationInfo,
    searchDestination
  };

  return (
    <TripPlanningContext.Provider value={value}>
      {children}
    </TripPlanningContext.Provider>
  );
}

export function useTripPlanning() {
  const context = useContext(TripPlanningContext);
  if (context === undefined) {
    throw new Error('useTripPlanning must be used within a TripPlanningProvider');
  }
  return context;
}