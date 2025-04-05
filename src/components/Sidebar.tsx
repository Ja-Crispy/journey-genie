import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  MessageSquare, 
  Settings,
  Plus,
  Calendar,
  Clock
} from 'lucide-react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import { Button } from './ui/button';

interface Props {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<Props> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { 
    chatHistory, 
    currentChatId, 
    setCurrentChatId, 
    startNewChat 
  } = useTripPlanning();

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
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
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Alex Johnson</h3>
                <p className="text-xs text-gray-500">alex@example.com</p>
              </div>
            </div>
          </div>

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
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Chat History</h4>
            <div className="space-y-2">
              {chatHistory.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                    chat.id === currentChatId ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={16} className="text-teal-500" />
                      <div>
                        <div className="text-sm font-medium line-clamp-1">{chat.title}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(chat.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 ${
                      location.pathname === '/' ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Calendar size={16} className={location.pathname === '/' ? 'text-white' : 'text-teal-500'} />
                    <span className="text-sm">Trip Planner</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 ${
                      location.pathname === '/settings' ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Settings size={16} className={location.pathname === '/settings' ? 'text-white' : 'text-teal-500'} />
                    <span className="text-sm">Settings</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
