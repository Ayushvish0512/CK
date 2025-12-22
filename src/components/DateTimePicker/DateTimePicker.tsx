import React, { useState, useMemo, useCallback } from 'react';
import { format, addDays, addWeeks, startOfWeek, isSameDay } from 'date-fns';
import { Settings, ChevronRight } from 'lucide-react';
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

  const handleNext = () => {
    setStep('time');
  };

  const handleBack = () => {
    setStep('date');
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selectedDate, hours, minutes, period);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="glass-card rounded-2xl shadow-glass overflow-hidden animate-scale-in">
        {step === 'date' ? (
          <>
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
            <div className="px-6 pb-4">
              <QuickSelect
                selected={quickSelect}
                onSelect={handleQuickSelect}
              />
            </div>

            {/* Next button */}
            <div className="flex gap-3 p-6 pt-2 bg-card/50">
              <button
                onClick={handleNext}
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
          </>
        ) : (
          <>
            {/* Time Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <button 
                onClick={handleBack}
                className="text-sm font-medium text-muted-foreground hover:text-foreground clock-transition"
              >
                ← {format(selectedDate, 'EEE, MMM d')}
              </button>
              <h2 className="text-base font-medium text-foreground">
                Set Time
              </h2>
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

            {/* Divider with active indicator */}
            <div className="relative px-6">
              <div className="h-px bg-border" />
              <div 
                className={`
                  absolute top-0 h-0.5 bg-primary
                  clock-transition
                  ${mode === 'hours' ? 'left-6 w-20' : 'right-6 w-20'}
                `}
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
          </>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
