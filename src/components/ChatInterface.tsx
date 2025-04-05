import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Groq from 'groq-sdk';
import { useTripPlanning } from '../contexts/TripPlanningContext';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
};

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const formatDateRange = (dates: Date[]) => {
  if (!dates.length) return "not selected";
  if (dates.length === 1) return dates[0].toLocaleDateString();
  return `${dates[0].toLocaleDateString()} to ${dates[dates.length - 1].toLocaleDateString()}`;
};

const extractDestination = (message: string): string | null => {
  // Common destination indicators
  const indicators = [
    'in ',
    'to ',
    'visit ',
    'explore ',
    'traveling to ',
    'going to ',
    'trip to ',
  ];

  const lowercaseMsg = message.toLowerCase();
  
  for (const indicator of indicators) {
    const index = lowercaseMsg.indexOf(indicator);
    if (index !== -1) {
      // Extract text after the indicator until the next punctuation or sentence end
      const startIndex = index + indicator.length;
      const endIndex = message.slice(startIndex).search(/[.,!?\n]|$/);
      if (endIndex !== -1) {
        const destination = message.slice(startIndex, startIndex + endIndex).trim();
        // Ensure it's a reasonable length and doesn't contain unwanted words
        if (destination.length > 1 && destination.length < 50) {
          return destination;
        }
      }
    }
  }
  return null;
};

const ChatInterface = () => {
  const {
    budget,
    selectedDates,
    selectedPreferences,
    setItinerary,
    setDestination,
    chatHistory, 
    currentChatId, 
    updateCurrentChat,
    startNewChat
  } = useTripPlanning();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Controlled scroll to bottom function with debounce
  const scrollToBottom = () => {
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set a new timeout for scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      scrollTimeoutRef.current = null;
    }, 100);
  };

  // Load messages only once when currentChatId changes
  useEffect(() => {
    if (!isInitialized || !chatHistory.length) {
      if (currentChatId) {
        const currentChat = chatHistory.find(chat => chat.id === currentChatId);
        if (currentChat?.messages?.length) {
          setMessages(currentChat.messages);
          setIsInitialized(true);
        } else if (chatHistory.length > 0) {
          startNewChat();
        }
      } else if (chatHistory.length > 0) {
        // If no chat is selected but there are saved chats, load the most recent one
        const mostRecentChat = chatHistory[0];
        setMessages(mostRecentChat.messages);
        setIsInitialized(true);
      } else {
        // If there are no chats, keep default welcome message
        setMessages([{
          id: 1,
          content: "Hello! I'm JourneyGenie, your AI travel assistant. How can I help plan your next adventure?",
          sender: "assistant"
        }]);
        setIsInitialized(true);
      }
    }
  }, []);

  // Handle chat switching
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatHistory.find(chat => chat.id === currentChatId);
      if (currentChat?.messages?.length) {
        // Reset state before loading new messages
        setIsInitialized(false);
        setMessages([]);
        
        // Small delay to ensure state is reset before setting new messages
        setTimeout(() => {
          setMessages(currentChat.messages);
          setIsInitialized(true);
        }, 50);
      }
    }
  }, [currentChatId]);

  // Synchronize local messages state with the context, but only when messages change
  // due to user interaction, not when loading from history
  useEffect(() => {
    if (currentChatId && messages.length > 0 && isInitialized) {
      updateCurrentChat(messages);
    }
  }, [messages, isInitialized]);

  // Scroll to bottom only when messages change and component is initialized
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      scrollToBottom();
    }
    
    // Clean up any pending timeout when unmounting
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, isInitialized]);

  const extractItineraryFromResponse = (response: string) => {
    try {
      // Look for day-by-day sections with more flexible pattern
      const dayMatches = response.match(/Day\s*\d+[:\s-]+[\s\S]*?(?=Day\s*\d+[:\s-]+|$)/g);
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

  const getGroqChatCompletion = async (messageContent: string) => {
    try {
      // Check for destination in user message
      const destinationFromUser = extractDestination(messageContent);
      if (destinationFromUser) {
        setDestination(destinationFromUser);
      }

      // Create a context-rich system message
      const systemMessage = `You are JourneyGenie, an expert AI travel assistant. Current trip planning context:
- Budget: $${budget[0]}
- Travel Dates: ${formatDateRange(selectedDates)}
- Preferences: ${selectedPreferences.join(', ') || 'None selected'}
${destinationFromUser ? `- Destination: ${destinationFromUser}` : ''}

When creating an itinerary:
1. Break down activities by day
2. Stay within the specified budget
3. Include activities matching user preferences
4. Format day-by-day itinerary as "Day X: {activities}"
5. Consider the length of stay based on selected dates

Create detailed, practical suggestions within these parameters.`;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
          })),
          {
            role: "user" as const,
            content: messageContent
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiResponse = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      // Extract and update itinerary if present in the response
      const extractedItinerary = extractItineraryFromResponse(aiResponse);
      if (extractedItinerary) {
        setItinerary(extractedItinerary);
      }

      // Check for destination in AI response if not found in user message
      if (!destinationFromUser) {
        const destinationFromAI = extractDestination(aiResponse);
        if (destinationFromAI) {
          setDestination(destinationFromAI);
        }
      }

      return aiResponse;
    } catch (error) {
      console.error('Error calling Groq:', error);
      return "I apologize, but I encountered an error. Please try again later.";
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await getGroqChatCompletion(inputValue);
      
      const assistantResponse: Message = {
        id: messages.length + 2,
        content: aiResponse,
        sender: 'assistant'
      };
      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        content: "I apologize, but I encountered an error. Please try again later.",
        sender: 'assistant'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-teal-coral-gradient">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${
              message.sender === 'user' 
                ? 'user-message animate-fade-in ml-auto bg-teal-500 text-white' 
                : 'assistant-message animate-fade-in mr-auto bg-white dark:bg-gray-800 dark:text-white'
            } p-3 rounded-lg max-w-[70%] shadow-sm`} // Adjusted max-width for better readability
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input section with wider padding */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isLoading}
            className="p-3 rounded-full bg-teal-500 text-white disabled:opacity-50 transition-opacity"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
