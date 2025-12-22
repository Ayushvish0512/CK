import React, { useState, useCallback } from 'react';
import { Pencil } from 'lucide-react';
import ClockDial from './ClockDial';
import TimeDisplay from './TimeDisplay';
import AmPmToggle from './AmPmToggle';

interface TimePickerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialPeriod?: 'AM' | 'PM';
  onCancel?: () => void;
  onApply?: (hours: number, minutes: number, period: 'AM' | 'PM') => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  initialHours = 7,
  initialMinutes = 0,
  initialPeriod = 'AM',
  onCancel,
  onApply,
}) => {
  // State for selected time
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initialPeriod);
  
  // State for current selection mode
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');

  // Handle value selection from clock dial
  const handleSelect = useCallback((value: number) => {
    if (mode === 'hours') {
      setHours(value === 0 ? 12 : value);
      // Automatically switch to minutes after selecting hours
      setTimeout(() => setMode('minutes'), 300);
    } else {
      setMinutes(value);
    }
  }, [mode]);

  // Handle apply button click
  const handleApply = () => {
    if (onApply) {
      onApply(hours, minutes, period);
    }
  };

  // Get the value to pass to clock dial
  const getDialValue = (): number => {
    if (mode === 'hours') {
      return hours === 12 ? 0 : hours;
    }
    return minutes;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-card rounded-2xl shadow-soft-xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-base font-medium text-muted-foreground">
            Date & Time
          </h2>
          <button className="p-2 rounded-full hover:bg-secondary clock-transition">
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </button>
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
            onSelect={handleSelect}
          />
          
          {/* AM/PM toggle */}
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
  );
};

export default TimePicker;
