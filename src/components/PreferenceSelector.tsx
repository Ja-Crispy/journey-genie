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
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Travel Preferences</h2>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {preferences.map(preference => (
          <div key={preference.id} className="text-center">
            <button
              onClick={() => togglePreference(preference.id)}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${
                selectedPreferences.includes(preference.id)
                  ? 'bg-teal-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={`Toggle ${preference.name} preference`}
              aria-pressed={selectedPreferences.includes(preference.id)}
            >
              <preference.icon size={24} />
            </button>
            <div className="mt-2 text-sm font-medium">{preference.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreferenceSelector;
