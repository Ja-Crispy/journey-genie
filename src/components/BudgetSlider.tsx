import React from 'react';
import { Slider } from "@/components/ui/slider";
import { useTripPlanning } from '@/contexts/TripPlanningContext';

const BudgetSlider = () => {
  const { budget, setBudget } = useTripPlanning();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Budget</h2>
      
      <div className="space-y-4">
        <Slider
          value={budget}
          onValueChange={setBudget}
          max={10000}
          min={100}
          step={100}
          className="w-full"
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Budget:</span>
          <span className="text-lg font-medium text-teal-600">${budget[0].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetSlider;
