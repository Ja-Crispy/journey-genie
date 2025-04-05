import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTripPlanning } from '@/contexts/TripPlanningContext';

const DAYS = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CalendarPicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { selectedDates, setSelectedDates } = useTripPlanning();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Create calendar grid
  const calendarDays = [];
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(selectedDate => 
      selectedDate.getDate() === date.getDate() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getFullYear() === date.getFullYear()
    );
  };

  const toggleDateSelection = (date: Date) => {
    const isSelected = isDateSelected(date);
    
    if (isSelected) {
      setSelectedDates(selectedDates.filter(selectedDate => 
        !(selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear())
      ));
    } else {
      const newDates = [...selectedDates, date].sort((a, b) => a.getTime() - b.getTime());
      setSelectedDates(newDates);
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Calendar</h2>
      
      <div className="mb-4 flex items-center justify-between">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-medium">
          {MONTHS[month]} {year}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <button
                onClick={() => toggleDateSelection(date)}
                className={`w-full h-full flex items-center justify-center rounded-full text-sm transition-colors ${
                  isDateSelected(date)
                    ? 'bg-coral-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>

      {selectedDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700">Selected Dates:</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
              <div key={index} className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
