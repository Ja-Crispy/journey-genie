import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

export function TripPlanningProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudget] = useState<number[]>([1500]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<Array<{ day: number; activities: string[] }>>([]);
  const [destination, setDestination] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

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

  const updateCurrentChat = (messages: Array<{ id: number; content: string; sender: 'user' | 'assistant' }>) => {
    if (!currentChatId) return;
    
    setChatHistory(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        // Try to extract a title from the first user message if it's a new chat
        let title = chat.title;
        if (title === 'New Chat' && messages.length > 1) {
          const firstUserMessage = messages.find(m => m.sender === 'user');
          if (firstUserMessage) {
            title = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
          }
        }
        return {
          ...chat,
          messages,
          title,
          destination
        };
      }
      return chat;
    }));
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
    updateCurrentChat
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