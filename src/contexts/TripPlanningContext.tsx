import React, { createContext, useContext, useState } from 'react';

interface TripPlanningContextType {
  budget: number[];
  setBudget: (budget: number[]) => void;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  selectedPreferences: string[];
  setSelectedPreferences: (preferences: string[]) => void;
  itinerary: Array<{
    day: number;
    activities: string[];
  }>;
  setItinerary: (itinerary: Array<{ day: number; activities: string[] }>) => void;
  destination: string;
  setDestination: (destination: string) => void;
}

const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

export function TripPlanningProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudget] = useState<number[]>([1500]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<Array<{ day: number; activities: string[] }>>([]);
  const [destination, setDestination] = useState<string>('');

  const value = {
    budget,
    setBudget,
    selectedDates,
    setSelectedDates,
    selectedPreferences,
    setSelectedPreferences,
    itinerary,
    setItinerary,
    destination,
    setDestination
  };

  return (
    <TripPlanningContext.Provider value={value}>
      {children}
    </TripPlanningContext.Provider>
  );
}

export function useTripPlanning() {
  const context = useContext(TripPlanningContext);
  if (context === undefined) {
    throw new Error('useTripPlanning must be used within a TripPlanningProvider');
  }
  return context;
}