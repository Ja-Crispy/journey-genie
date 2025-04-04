
import React, { useState } from 'react';
import { ChevronRight, Plane, Bed, Map, Check, Building, Utensils } from 'lucide-react';

type ItineraryItem = {
  id: string;
  activity: string;
  time?: string;
  cost?: number;
  icon: React.ElementType;
  completed?: boolean;
};

type DayPlan = {
  day: number;
  date: string;
  items: ItineraryItem[];
};

const ItineraryDisplay = () => {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [itinerary, setItinerary] = useState<DayPlan[]>([
    {
      day: 1,
      date: 'June 19, 2024',
      items: [
        { 
          id: '1-1', 
          activity: 'Flight to Barcelona', 
          time: '8:30 AM', 
          cost: 350, 
          icon: Plane 
        },
        { 
          id: '1-2', 
          activity: 'Check-in at Hotel', 
          time: '11:00 AM', 
          cost: 120, 
          icon: Bed,
          completed: true
        },
        { 
          id: '1-3', 
          activity: 'Explore Barri Gòtic', 
          cost: 0, 
          icon: Map,
          completed: true
        }
      ]
    },
    {
      day: 2,
      date: 'June 20, 2024',
      items: [
        { 
          id: '2-1', 
          activity: 'Visit Sagrada Familia', 
          time: '10:00 AM', 
          cost: 25, 
          icon: Building
        },
        { 
          id: '2-2', 
          activity: 'Lunch at La Boqueria', 
          time: '1:30 PM', 
          cost: 30, 
          icon: Utensils
        },
        { 
          id: '2-3', 
          activity: 'Park Güell Tour', 
          time: '4:00 PM', 
          cost: 15, 
          icon: Map
        }
      ]
    }
  ]);

  const toggleDay = (day: number) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const toggleItemCompletion = (dayIndex: number, itemId: string) => {
    const updatedItinerary = [...itinerary];
    const item = updatedItinerary[dayIndex].items.find(i => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
      setItinerary(updatedItinerary);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
      
      <div className="space-y-3">
        {itinerary.map((day, dayIndex) => (
          <div key={day.day} className="day-card">
            <div 
              className="day-card-header cursor-pointer"
              onClick={() => toggleDay(day.day)}
            >
              <h3 className="font-medium">Day {day.day}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm opacity-80">{day.date}</span>
                <ChevronRight 
                  size={18} 
                  className={`transition-transform ${expandedDay === day.day ? 'rotate-90' : ''}`} 
                />
              </div>
            </div>
            
            {expandedDay === day.day && (
              <div className="bg-white animate-fade-in">
                {day.items.map((item) => (
                  <div key={item.id} className="itinerary-item">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => toggleItemCompletion(dayIndex, item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.completed 
                            ? 'bg-teal-500 text-white' 
                            : 'border border-gray-300'
                        }`}
                        aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {item.completed && <Check size={14} />}
                      </button>
                      <div>
                        <div className="flex items-center space-x-2">
                          <item.icon size={16} className="text-teal-600" />
                          <span className={item.completed ? 'line-through text-gray-400' : ''}>
                            {item.activity}
                          </span>
                        </div>
                        {item.time && (
                          <span className="time-badge">{item.time}</span>
                        )}
                      </div>
                    </div>
                    {item.cost !== undefined && item.cost > 0 && (
                      <span className="cost-badge">${item.cost}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
