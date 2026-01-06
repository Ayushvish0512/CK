import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface MonthCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ selectedDate, onSelectDate, onClose }) => {
  const today = startOfDay(new Date());
  const nextMonth = addMonths(today, 1);
  const [currentMonth, setCurrentMonth] = useState(nextMonth);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate all days for the calendar grid
  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const goToPrevMonth = () => {
    const prevMonth = addMonths(currentMonth, -1);
    // Only allow going to next month or later
    if (!isBefore(startOfMonth(prevMonth), startOfMonth(nextMonth))) {
      setCurrentMonth(prevMonth);
    }
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const canGoPrev = !isBefore(startOfMonth(addMonths(currentMonth, -1)), startOfMonth(nextMonth));

  return (
    <div className="glass-card rounded-2xl p-4 shadow-glass animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            disabled={!canGoPrev}
            className={`
              p-2 rounded-full clock-transition
              ${canGoPrev 
                ? 'hover:bg-secondary/50 text-foreground' 
                : 'text-muted-foreground/30 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-secondary/50 text-foreground clock-transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/50 text-foreground clock-transition ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-muted-foreground py-2">
            {name}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = isSameDay(date, selectedDate);
          const isPast = isBefore(date, today);
          const isDisabled = !isCurrentMonth || isPast;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onSelectDate(date)}
              disabled={isDisabled}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center
                text-sm font-medium clock-transition
                ${isSelected && !isDisabled
                  ? 'date-gradient-active text-primary-foreground shadow-soft-md' 
                  : isDisabled
                    ? 'text-muted-foreground/30 cursor-not-allowed'
                    : 'text-foreground hover:bg-secondary/50'
                }
              `}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
