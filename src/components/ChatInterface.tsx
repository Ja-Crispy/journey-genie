
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! How can I assist you with your travel plans?",
      sender: "assistant"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user'
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate assistant response after 1 second
    setTimeout(() => {
      const assistantResponse: Message = {
        id: messages.length + 2,
        content: `I'll help you plan a trip to ${inputValue.includes('Barcelona') ? 'Barcelona' : 'your destination'}. What's your budget and when would you like to travel?`,
        sender: 'assistant'
      };
      setMessages(prev => [...prev, assistantResponse]);
    }, 1000);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // Simulate voice input if recording
    if (!isRecording) {
      setTimeout(() => {
        setInputValue('Suggest a budget-friendly itinerary for Barcelona');
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-teal-coral-gradient">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${message.sender === 'user' ? 'user-message animate-fade-in' : 'assistant-message animate-fade-in'}`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white rounded-b-3xl">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ''}
            className="p-3 rounded-full bg-teal-500 text-white disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
          <button 
            onClick={toggleRecording}
            className={`p-3 rounded-full ${isRecording ? 'bg-coral-500 animate-pulse-gentle' : 'bg-gray-200'} text-white`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <Mic size={20} className={isRecording ? 'text-white' : 'text-gray-700'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
