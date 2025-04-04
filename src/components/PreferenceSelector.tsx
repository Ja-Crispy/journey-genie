
import React, { useState } from 'react';
import { Mountain, Utensils, Building } from 'lucide-react';

type Preference = 'adventure' | 'food' | 'culture';

const PreferenceSelector = () => {
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>(['adventure']);

  const preferences = [
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'food', name: 'Food & Dining', icon: Utensils },
    { id: 'culture', name: 'Culture', icon: Building }
  ];

  const togglePreference = (preference: Preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Preferences</h2>
      
      <div className="flex justify-around">
        {preferences.map(preference => (
          <div key={preference.id} className="text-center">
            <button
              onClick={() => togglePreference(preference.id as Preference)}
              className={`preference-toggle ${selectedPreferences.includes(preference.id as Preference) ? 'active' : 'inactive'}`}
              aria-label={`Toggle ${preference.name} preference`}
              aria-pressed={selectedPreferences.includes(preference.id as Preference)}
            >
              <preference.icon size={24} />
            </button>
            <div className="mt-2 text-sm">{preference.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreferenceSelector;
