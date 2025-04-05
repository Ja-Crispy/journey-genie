import React from 'react';
import { Menu, X, MessageSquare, Plus, Clock, MoreVertical, Trash2 } from 'lucide-react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<Props> = ({ isOpen, toggleSidebar }) => {
  const { 
    chatHistory, 
    currentChatId, 
    loadChatSession,
    startNewChat,
    setChatHistory 
  } = useTripPlanning();

  const handleChatSelect = (chatId: string) => {
    loadChatSession(chatId);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Remove chat from history
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    // If the current chat is being deleted, start a new chat
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden dark:bg-gray-800 dark:text-gray-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out dark:bg-gray-800 dark:text-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* New Chat Button */}
          <div className="p-4">
            <Button 
              onClick={startNewChat}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Plus size={16} className="mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Chat History</h4>
            <div className="space-y-2">
              {chatHistory.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    chat.id === currentChatId ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={16} className="text-teal-500" />
                      <div>
                        <div className="text-sm font-medium line-clamp-1">{chat.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(chat.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                          <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem 
                          onClick={(e) => handleDeleteChat(chat.id, e as any)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
