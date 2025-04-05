import React from 'react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

const ChatHistory = () => {
  const { chatHistory, currentChatId, loadChatSession, startNewChat } = useTripPlanning();

  return (
    <div className="space-y-4">
      <Button 
        className="w-full justify-start" 
        variant="outline"
        onClick={startNewChat}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        New Chat
      </Button>

      <div className="space-y-2">
        {chatHistory.map((chat) => (
          <Button
            key={chat.id}
            className={`w-full justify-start ${
              currentChatId === chat.id ? 'bg-primary text-primary-foreground' : ''
            }`}
            variant="ghost"
            onClick={() => loadChatSession(chat.id)}
          >
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{chat.title || 'Untitled Chat'}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(chat.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
