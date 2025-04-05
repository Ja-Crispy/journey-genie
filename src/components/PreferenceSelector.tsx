import React from 'react';
import { Mountain, Utensils, Building, Camera, Users, Umbrella } from 'lucide-react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';

const PreferenceSelector = () => {
  const { selectedPreferences, setSelectedPreferences } = useTripPlanning();

  const preferences = [
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'food', name: 'Food & Dining', icon: Utensils },
    { id: 'culture', name: 'Culture', icon: Building },
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'relaxation', name: 'Relaxation', icon: Umbrella }
  ];

  const togglePreference = (preferenceId: string) => {
    if (selectedPreferences.includes(preferenceId)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preferenceId));
    } else {
      setSelectedPreferences([...selectedPreferences, preferenceId]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Travel Preferences</h2>
      <div className="grid grid-cols-2 gap-2">
        {preferences.map(pref => (
          <button
            key={pref.id}
            onClick={() => togglePreference(pref.id)}
            className={`
              flex items-center gap-2 p-2 rounded-lg transition-colors text-sm
              ${
                selectedPreferences.includes(pref.id)
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <pref.icon size={14} />
            <span className="font-medium">{pref.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreferenceSelector;
