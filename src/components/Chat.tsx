import React, { useState } from 'react';
import { useTripPlanning } from '../contexts/TripPlanningContext';
import Message from './Message';
import Loader2 from './Loader2';

export function Chat() {
  const { messages, sendMessage, isTyping, destinationInfo } = useTripPlanning();
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}

        {/* Show when destination info is loaded */}
        {destinationInfo && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p className="font-medium mb-1">Loaded information about your destination:</p>
            <p>{destinationInfo.description}</p>
          </div>
        )}

        {isTyping && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Searching and thinking...</span>
          </div>
        )}
      </div>

      {/* ...rest of component... */}
    </div>
  );
}