
import React from 'react';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-ivory py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-teal-400">Wanderlust Unleashed</h2>
            <p className="text-sm text-gray-400 mt-2">Your AI travel companion</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Agentic Travel Assistant. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors duration-300">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
