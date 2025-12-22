import React, { useState, useMemo, useCallback, useRef } from 'react';
import { format, addDays, addWeeks, startOfWeek, isSameDay } from 'date-fns';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import ClockDial from '../TimePicker/ClockDial';
import TimeDisplay from '../TimePicker/TimeDisplay';
import AmPmToggle from '../TimePicker/AmPmToggle';
import QuickSelect from '../DatePicker/QuickSelect';
import WeekStrip from '../DatePicker/WeekStrip';
import MonthCalendar from '../DatePicker/MonthCalendar';

type QuickSelectOption = 'today' | 'tomorrow' | 'nextWeek' | 'month';
type ViewMode = 'weekly' | 'monthly';
type Step = 'date' | 'time';

interface DateTimePickerProps {
  initialDate?: Date;
  initialHours?: number;
  initialMinutes?: number;
  initialPeriod?: 'AM' | 'PM';
  onApply?: (date: Date, hours: number, minutes: number, period: 'AM' | 'PM') => void;
  onCancel?: () => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  initialDate,
  initialHours = 7,
  initialMinutes = 0,
  initialPeriod = 'AM',
  onApply,
  onCancel,
}) => {
  const today = new Date();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Step state
  const [step, setStep] = useState<Step>('date');
  
  // Date state
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || today);
  const [quickSelect, setQuickSelect] = useState<QuickSelectOption | null>('today');
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  
  // Time state
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod);
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');

  const weekStartDate = useMemo(() => {
    return startOfWeek(selectedDate, { weekStartsOn: 0 });
  }, [selectedDate]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && step === 'date') {
        // Swipe left -> go to time
        setStep('time');
      } else if (diff < 0 && step === 'time') {
        // Swipe right -> go to date
        setStep('date');
      }
    }
  };

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
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setQuickSelect(null);
    
    if (isSameDay(date, today)) {
      setQuickSelect('today');
    } else if (isSameDay(date, addDays(today, 1))) {
      setQuickSelect('tomorrow');
    }
    
    if (showMonthCalendar) {
      setShowMonthCalendar(false);
    }
  };

  const handleTimeSelect = useCallback((value: number) => {
    if (mode === 'hours') {
      setHours(value === 0 ? 12 : value);
      setTimeout(() => setMode('minutes'), 300);
    } else {
      setMinutes(value);
    }
  }, [mode]);

  const getDialValue = (): number => {
    if (mode === 'hours') {
      return hours === 12 ? 0 : hours;
    }
    return minutes;
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selectedDate, hours, minutes, period);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        ref={containerRef}
        className="glass-card rounded-2xl shadow-glass overflow-hidden animate-scale-in"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Step indicator tabs */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex bg-secondary/50 rounded-full p-1">
            <button
              onClick={() => setStep('date')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                clock-transition
                ${step === 'date'
                  ? 'bg-card text-foreground shadow-soft-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Date
            </button>
            <button
              onClick={() => setStep('time')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium
                clock-transition
                ${step === 'time'
                  ? 'bg-card text-foreground shadow-soft-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              Time
            </button>
          </div>
          <button className="p-2 rounded-full glass-card hover:bg-secondary/50 clock-transition">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Step indicator line */}
        <div className="relative px-6 mb-4">
          <div className="h-px bg-border" />
          <div 
            className={`
              absolute top-0 h-0.5 bg-primary
              clock-transition duration-300
              w-20
              ${step === 'date' ? 'left-6' : 'right-6'}
            `}
          />
        </div>

        {/* Swipeable content */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${step === 'date' ? '0%' : '-50%'})`, width: '200%' }}
          >
            {/* Date Section */}
            <div className="w-1/2 flex-shrink-0">
              {/* Date display with back functionality */}
              <div className="px-6 py-4">
                <div className="flex items-baseline justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-muted-foreground">{format(selectedDate, 'yyyy')}</span>
                    <h2 className="text-3xl font-bold text-foreground">
                      {format(selectedDate, 'MMMM')}
                    </h2>
                  </div>
                  <span className="text-4xl font-bold text-muted-foreground/50">
                    {format(selectedDate, 'd')}
                  </span>
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center justify-center px-6 pb-4">
                <div className="flex bg-secondary/30 rounded-full p-1">
                  <button
                    onClick={() => setViewMode('weekly')}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium
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
                      px-3 py-1.5 rounded-full text-xs font-medium
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
              <div className="px-6 pb-4">
                <QuickSelect
                  selected={quickSelect}
                  onSelect={handleQuickSelect}
                />
              </div>

              {/* Next button */}
              <div className="flex gap-3 p-6 pt-2 bg-card/50">
                <button
                  onClick={() => setStep('time')}
                  className="
                    flex-1 py-3 px-6
                    text-sm font-semibold text-primary-foreground
                    bg-primary rounded-xl
                    hover:bg-primary/90
                    shadow-soft-md
                    clock-transition
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                    flex items-center justify-center gap-2
                  "
                >
                  Select Time
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Time Section */}
            <div className="w-1/2 flex-shrink-0">
              {/* Time Header with date back */}
              <div className="px-6 py-4">
                <div className="flex items-baseline justify-between">
                  <button 
                    onClick={() => setStep('date')}
                    className="flex flex-col items-start group cursor-pointer"
                  >
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <ChevronLeft className="w-3 h-3" />
                      {format(selectedDate, 'yyyy')}
                    </span>
                    <h2 className="text-3xl font-bold text-foreground group-hover:text-primary clock-transition">
                      {format(selectedDate, 'MMM d')}
                    </h2>
                  </button>
                  <span className="text-lg font-medium text-muted-foreground">
                    Set Time
                  </span>
                </div>
              </div>

              {/* Time display */}
              <div className="px-6">
                <TimeDisplay
                  hours={hours}
                  minutes={minutes}
                  mode={mode}
                  onModeChange={setMode}
                />
              </div>

              {/* Clock dial section */}
              <div className="px-6 py-8 bg-clock-bg/30">
                <ClockDial
                  mode={mode}
                  selectedValue={getDialValue()}
                  onSelect={handleTimeSelect}
                />
                
                <AmPmToggle
                  period={period}
                  onChange={setPeriod}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 p-6 bg-card">
                <button
                  onClick={onCancel}
                  className="
                    flex-1 py-3 px-6
                    text-sm font-semibold text-foreground
                    bg-secondary rounded-xl
                    hover:bg-secondary/80
                    clock-transition
                    focus:outline-none focus:ring-2 focus:ring-ring/20
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="
                    flex-1 py-3 px-6
                    text-sm font-semibold text-primary-foreground
                    bg-primary rounded-xl
                    hover:bg-primary/90
                    shadow-soft-md
                    clock-transition
                    focus:outline-none focus:ring-2 focus:ring-primary/20
                  "
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
