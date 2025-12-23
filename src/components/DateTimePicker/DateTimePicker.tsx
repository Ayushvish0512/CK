import React, { useState, useMemo, useCallback, useRef } from 'react';
import { 
  format, 
  addDays, 
  addWeeks, 
  addMonths,
  startOfWeek, 
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isAfter,
  isBefore,
  startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, X, Clock, Calendar } from 'lucide-react';

type QuickSelectOption = 'today' | 'tomorrow' | 'nextWeek' | 'month';
type ViewMode = 'weekly' | 'monthly';
type Step = 'date' | 'time';

// ============= ClockDial Component =============
interface ClockDialProps {
  mode: 'hours' | 'minutes';
  selectedValue: number;
  onSelect: (value: number) => void;
}

const ClockDial: React.FC<ClockDialProps> = ({ mode, selectedValue, onSelect }) => {
  const numbers = mode === 'hours' 
    ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const getHandAngle = (): number => {
    if (mode === 'hours') {
      return (selectedValue % 12) * 30 - 90;
    }
    return (selectedValue / 60) * 360 - 90;
  };

  const getNumberPosition = (index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const radius = 42;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  const isSelected = (value: number): boolean => {
    if (mode === 'hours') {
      return selectedValue === value || (selectedValue === 0 && value === 12);
    }
    return selectedValue === value;
  };

  const handleNumberClick = (value: number) => {
    if (mode === 'hours') {
      onSelect(value === 12 ? 0 : value);
    } else {
      onSelect(value);
    }
  };

  const handAngle = getHandAngle();
  const handLength = 32;
  const handEndX = 50 + handLength * Math.cos(handAngle * (Math.PI / 180));
  const handEndY = 50 + handLength * Math.sin(handAngle * (Math.PI / 180));

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 rounded-full bg-clock-dial" />
      
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <line
          x1="50"
          y1="50"
          x2={handEndX}
          y2={handEndY}
          stroke="hsl(var(--clock-hand))"
          strokeWidth="1.5"
          className="clock-hand-transition"
        />
        <circle cx="50" cy="50" r="3" fill="hsl(var(--clock-center))" />
        <circle
          cx={handEndX}
          cy={handEndY}
          r="2.5"
          fill="hsl(var(--clock-hand))"
          className="clock-hand-transition"
        />
      </svg>

      {numbers.map((num, index) => {
        const pos = getNumberPosition(index);
        const selected = isSelected(num);
        const displayNum = mode === 'minutes' ? num.toString().padStart(2, '0') : num;
        
        return (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={`
              absolute w-10 h-10 -ml-5 -mt-5 rounded-full
              flex items-center justify-center
              text-sm font-medium
              clock-transition
              focus:outline-none focus:ring-2 focus:ring-primary/20
              ${selected 
                ? 'bg-primary text-primary-foreground shadow-soft-md scale-110' 
                : 'text-clock-number hover:bg-secondary/80'
              }
            `}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            {displayNum}
          </button>
        );
      })}
    </div>
  );
};

// ============= TimeDisplay Component =============
interface TimeDisplayProps {
  hours: number;
  minutes: number;
  mode: 'hours' | 'minutes';
  onModeChange: (mode: 'hours' | 'minutes') => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  hours, 
  minutes, 
  mode, 
  onModeChange 
}) => {
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return (
    <div className="flex items-baseline">
      <button
        onClick={() => onModeChange('hours')}
        className={`
          text-3xl font-bold tracking-tight
          clock-transition
          ${mode === 'hours' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground/80'
          }
        `}
      >
        {displayHours.toString().padStart(2, '0')}
      </button>
      <span className="text-3xl font-bold text-foreground mx-0.5">:</span>
      <button
        onClick={() => onModeChange('minutes')}
        className={`
          text-3xl font-bold tracking-tight
          clock-transition
          ${mode === 'minutes' 
            ? 'text-foreground' 
            : 'text-muted-foreground hover:text-foreground/80'
          }
        `}
      >
        {minutes.toString().padStart(2, '0')}
      </button>
    </div>
  );
};

// ============= AmPmToggle Component =============
interface AmPmToggleProps {
  period: 'AM' | 'PM';
  onChange: (period: 'AM' | 'PM') => void;
}

const AmPmToggle: React.FC<AmPmToggleProps> = ({ period, onChange }) => {
  return (
    <div className="flex items-center justify-between px-2 mt-6">
      <button
        onClick={() => onChange('AM')}
        className={`
          px-4 py-2 text-sm font-medium rounded-lg
          clock-transition
          ${period === 'AM'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
          }
        `}
      >
        AM
      </button>
      
      <div className="flex-1" />
      
      <button
        onClick={() => onChange('PM')}
        className={`
          px-5 py-2.5 text-sm font-semibold rounded-xl
          clock-transition
          ${period === 'PM'
            ? 'bg-primary text-primary-foreground shadow-soft-md'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }
        `}
      >
        PM
      </button>
    </div>
  );
};

// ============= QuickSelect Component =============
interface QuickSelectProps {
  selected: QuickSelectOption | null;
  onSelect: (option: QuickSelectOption) => void;
}

const QuickSelect: React.FC<QuickSelectProps> = ({ selected, onSelect }) => {
  const options: { key: QuickSelectOption; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'tomorrow', label: 'Tomorrow' },
    { key: 'nextWeek', label: 'Next Week' },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onSelect(option.key)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            clock-transition
            ${selected === option.key
              ? 'glass-card text-foreground shadow-glass'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// ============= WeekStrip Component =============
interface WeekStripProps {
  selectedDate: Date;
  weekStartDate: Date;
  onSelectDate: (date: Date) => void;
}

const WeekStrip: React.FC<WeekStripProps> = ({ selectedDate, weekStartDate, onSelectDate }) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i));

  return (
    <div className="relative">
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

// ============= MonthCalendar Component =============
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

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const goToPrevMonth = () => {
    const prevMonth = addMonths(currentMonth, -1);
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

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-muted-foreground py-2">
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelectedDay = isSameDay(date, selectedDate);
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
                ${isSelectedDay && !isDisabled
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

// ============= Main DateTimePicker Component =============
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
        setStep('time');
      } else if (diff < 0 && step === 'time') {
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
        <div className="flex items-center justify-center px-6 pt-6 pb-2">
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
              {/* Date display */}
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
                    onClick={() => {
                      setViewMode('weekly');
                      setShowMonthCalendar(false);
                    }}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium
                      clock-transition
                      ${viewMode === 'weekly' && !showMonthCalendar
                        ? 'bg-card text-foreground shadow-soft-sm'
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('monthly');
                      setShowMonthCalendar(true);
                    }}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium
                      clock-transition
                      ${viewMode === 'monthly' || showMonthCalendar
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
                    onClose={() => {
                      setShowMonthCalendar(false);
                      setViewMode('weekly');
                    }}
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
              {/* Time display - same position as date display */}
              <div className="px-6 py-4">
                <div className="flex items-baseline justify-between">
                  <button 
                    onClick={() => setStep('date')}
                    className="flex items-center gap-2 group cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary clock-transition" />
                    <TimeDisplay
                      hours={hours}
                      minutes={minutes}
                      mode={mode}
                      onModeChange={setMode}
                    />
                  </button>
                  <span className="text-4xl font-bold text-muted-foreground/50">
                    {period}
                  </span>
                </div>
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

                {/* Action buttons */}
                <div className="flex items-center justify-between px-2 mt-6">
                  <button
                    onClick={onCancel}
                    className="
                      px-5 py-2.5 text-sm font-semibold rounded-xl
                      clock-transition
                      bg-secondary text-secondary-foreground
                      hover:bg-secondary/80
                      border border-border
                    "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="
                      px-5 py-2.5 text-sm font-semibold rounded-xl
                      clock-transition
                      bg-secondary text-secondary-foreground
                      hover:bg-secondary/80
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
    </div>
  );
};

export default DateTimePicker;
