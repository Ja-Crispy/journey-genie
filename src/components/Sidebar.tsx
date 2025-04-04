
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, MessageSquare, Settings } from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const previousChats = [
    { id: 1, title: "Trip to Paris", date: "Mar 15" },
    { id: 2, title: "Weekend in Rome", date: "Apr 2" },
    { id: 3, title: "Tokyo adventure", date: "Apr 30" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-teal-500 text-white md:hidden"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
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

          {/* Previous Chats */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Previous Chats</h4>
            <ul className="space-y-2">
              {previousChats.map(chat => (
                <li key={chat.id}>
                  <button className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center space-x-2">
                    <MessageSquare size={16} className="text-teal-500" />
                    <div>
                      <div className="text-sm font-medium">{chat.title}</div>
                      <div className="text-xs text-gray-500">{chat.date}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t">
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/chat" 
                    className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 ${
                      location.pathname === '/chat' ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <MessageSquare size={16} className={location.pathname === '/chat' ? 'text-white' : 'text-teal-500'} />
                    <span className="text-sm">Chat</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className={`w-full text-left p-2 rounded-lg flex items-center space-x-2 ${
                      location.pathname === '/profile' ? 'bg-teal-500 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    <User size={16} className={location.pathname === '/profile' ? 'text-white' : 'text-teal-500'} />
                    <span className="text-sm">Profile</span>
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

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
