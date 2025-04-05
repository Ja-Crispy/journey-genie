import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import BudgetSlider from '../components/BudgetSlider';
import CalendarPicker from '../components/CalendarPicker';
import PreferenceSelector from '../components/PreferenceSelector';
import ItineraryDisplay from '../components/ItineraryDisplay';
import MapDisplay from '../components/MapDisplay';
import { ThemeToggle } from '../components/theme-toggle';
import { TripPlanningProvider } from '../contexts/TripPlanningContext';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <TripPlanningProvider>
      <div className="min-h-screen bg-ivory dark:bg-gray-900 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-64">
          {/* Header */}
          <header className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between">
            <h1 className="text-xl font-bold text-teal-500">JourneyGenie</h1>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </header>

          {/* Main layout */}
          <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Chat section */}
            <div className="lg:col-span-5 flex flex-col h-[calc(100vh-8rem)]">
              <ChatInterface />
            </div>

            {/* Right panel with planning tools */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min content-start">
              {/* First row: Budget & Calendar */}
              <div className="md:col-span-1">
                <BudgetSlider />
              </div>
              <div className="md:col-span-1">
                <CalendarPicker />
              </div>

              {/* Second row: Preferences */}
              <div className="md:col-span-2">
                <PreferenceSelector />
              </div>

              {/* Third row: Itinerary */}
              <div className="md:col-span-2">
                <ItineraryDisplay />
              </div>

              {/* Fourth row: Map */}
              <div className="md:col-span-2">
                <MapDisplay />
              </div>
            </div>
          </main>
        </div>
      </div>
    </TripPlanningProvider>
  );
};

export default Index;
