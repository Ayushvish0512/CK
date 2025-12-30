import React, { useState, useMemo } from 'react';
import { format, addDays, addWeeks, startOfWeek, isSameDay } from 'date-fns';
import { Settings } from 'lucide-react';
import QuickSelect from './QuickSelect';
import WeekStrip from './WeekStrip';
import MonthCalendar from './MonthCalendar';

type QuickSelectOption = 'today' | 'tomorrow' | 'nextWeek' | 'month';
type ViewMode = 'weekly' | 'monthly';

interface DatePickerProps {
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ initialDate, onDateChange }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || today);
  const [quickSelect, setQuickSelect] = useState<QuickSelectOption | null>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);

  // Calculate week start based on selected date
  const weekStartDate = useMemo(() => {
    return startOfWeek(selectedDate, { weekStartsOn: 0 });
  }, [selectedDate]);

  const handleQuickSelect = (option: QuickSelectOption) => {
    setQuickSelect(option);
    
    if (option === 'month') {
      setShowMonthCalendar(true);
      return;
    }

    setShowMonthCalendar(false);
    let newDate: Date;
    
    switch (option) {
      case 'today':
        newDate = today;
        break;
      case 'tomorrow':
        newDate = addDays(today, 1);
        break;
      case 'nextWeek':
        newDate = addWeeks(today, 1);
        break;
      default:
        newDate = today;
    }

    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setQuickSelect(null);
    
    // Check if date matches any quick select option
    if (isSameDay(date, today)) {
      setQuickSelect('today');
    } else if (isSameDay(date, addDays(today, 1))) {
      setQuickSelect('tomorrow');
    }
    
    onDateChange?.(date);
    if (showMonthCalendar) {
      setShowMonthCalendar(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="glass-card rounded-3xl shadow-glass overflow-hidden animate-scale-in">
        {/* Header with view toggle */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex bg-secondary/50 rounded-full p-1">
            <button
              onClick={() => setViewMode('weekly')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                clock-transition
                ${viewMode === 'weekly'
                  ? 'bg-card text-foreground shadow-soft-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                clock-transition
                ${viewMode === 'monthly'
                  ? 'bg-card text-foreground shadow-soft-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Monthly
            </button>
          </div>
          <button className="p-2 rounded-full glass-card hover:bg-secondary/50 clock-transition">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Month and Date display */}
        <div className="px-6 py-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold text-foreground">
              {format(selectedDate, 'MMMM')}
            </h2>
            <span className="text-4xl font-bold text-muted-foreground/50">
              {format(selectedDate, 'd')}
            </span>
          </div>
        </div>

        {/* Week strip or Month calendar */}
        <div className="px-4 pb-6">
          {showMonthCalendar ? (
            <MonthCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              onClose={() => setShowMonthCalendar(false)}
            />
          ) : (
            <WeekStrip
              selectedDate={selectedDate}
              weekStartDate={weekStartDate}
              onSelectDate={handleDateSelect}
            />
          )}
        </div>

        {/* Quick select options */}
        <div className="px-6 pb-6">
          <QuickSelect
            selected={quickSelect}
            onSelect={handleQuickSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
