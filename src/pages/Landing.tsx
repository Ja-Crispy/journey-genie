import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import '../App.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center z-0 hero-background"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12 z-10">
          <div className="w-full max-w-2xl mx-auto text-white space-y-6 animate-fade-in text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              JourneyGenie
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Your AI-powered compass to extraordinary adventures. Let magic guide your travels.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 transform hover:scale-105"
                onClick={handleGetStarted}
              >
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
