import React from 'react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';
import { Calendar, MapPin, Clock } from 'lucide-react';

const ItineraryDisplay = () => {
  const { itinerary, selectedDates } = useTripPlanning();

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
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>

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
