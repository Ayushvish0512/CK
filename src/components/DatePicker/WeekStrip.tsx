import React from 'react';
import { format, addDays, isSameDay, startOfWeek } from 'date-fns';

interface WeekStripProps {
  selectedDate: Date;
  weekStartDate: Date;
  onSelectDate: (date: Date) => void;
}

const WeekStrip: React.FC<WeekStripProps> = ({ selectedDate, weekStartDate, onSelectDate }) => {
  // Generate 7 days starting from weekStartDate
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  return (
    <div className="relative">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-bg rounded-2xl opacity-30" />
      
      <div className="relative flex justify-between items-end py-4 px-2">
        {days.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayName = format(date, 'EEE');
          const dayNumber = format(date, 'd');
          
          return (
            <button
              key={index}
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center gap-2 group clock-transition"
            >
              <span className={`
                text-xs font-medium uppercase tracking-wide
                clock-transition
                ${isSelected ? 'text-foreground' : 'text-muted-foreground/70'}
              `}>
                {dayName}
              </span>
              
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-semibold
                clock-transition
                ${isSelected 
                  ? 'date-gradient-active text-primary-foreground shadow-soft-lg' 
                  : 'text-foreground group-hover:bg-secondary/50'
                }
              `}>
                {dayNumber}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeekStrip;
