import React from 'react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import { Calendar, MapPin, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateItineraryPDF } from '@/utils/pdfGenerator';

const ItineraryDisplay = () => {
  const { itinerary, selectedDates, destination, budget } = useTripPlanning();

  const handleDownloadPDF = () => {
    generateItineraryPDF(
      itinerary,
      destination || 'Your Trip',
      selectedDates.length > 0 ? selectedDates[0] : undefined,
      selectedDates.length > 1 ? selectedDates[selectedDates.length - 1] : undefined,
      budget[0]
    );
  };

  if (!itinerary.length) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p>Chat with JourneyGenie to create your personalized itinerary!</p>
          <p className="text-sm mt-2">Your travel plan will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Your Itinerary</h2>
        {itinerary.length > 0 && (
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 text-teal-500 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-700"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </Button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {selectedDates.length > 0
              ? `${selectedDates[0].toLocaleDateString()} - ${selectedDates[selectedDates.length - 1].toLocaleDateString()}`
              : 'Dates not selected'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {itinerary.map((day) => (
          <div
            key={day.day}
            className="border rounded-lg p-4 transition-shadow hover:shadow-md"
          >
            <h3 className="font-medium text-teal-600 mb-2">Day {day.day}</h3>
            <ul className="space-y-3">
              {day.activities.map((activity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="mt-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-coral-500"></div>
                  </div>
                  <span className="text-sm">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
