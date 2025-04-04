
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const BudgetSlider = () => {
  const [budget, setBudget] = useState(2000);
  const [spent, setSpent] = useState(750); // Simulated amount spent
  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(Number(e.target.value));
  };
  
  // Calculate percentage spent for the progress ring
  const percentage = Math.min(Math.round((spent / budget) * 100), 100);
  const circumference = 2 * Math.PI * 40; // Circle radius is 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on percentage
  const getColor = () => {
    if (percentage > 90) return 'text-red-500';
    if (percentage > 70) return 'text-amber-500';
    return 'text-teal-500';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Budget</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={getColor()}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <DollarSign size={24} className={getColor()} />
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">Spent</p>
          <p className="text-xl font-bold">${spent} / ${budget}</p>
        </div>
      </div>
      
      <div className="mb-2">
        <input
          type="range"
          min="500"
          max="10000"
          step="100"
          value={budget}
          onChange={handleBudgetChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coral-500"
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>$500</span>
        <span>${budget}</span>
        <span>$10,000</span>
      </div>
    </div>
  );
};

export default BudgetSlider;
