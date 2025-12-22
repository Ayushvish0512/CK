import React from 'react';
import { Clock, Calendar } from 'lucide-react';

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
  // Format hours for 12-hour display
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  
  return (
    <div className="flex items-end justify-between mb-6">
      {/* Date section */}
      <div className="flex flex-col items-start">
        <span className="text-xs text-primary font-medium mb-1">2024</span>
        <span className="text-2xl font-semibold text-foreground">Dec 22</span>
        <div className="mt-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      
      {/* Time section */}
      <div className="flex flex-col items-end">
        <div className="flex items-baseline">
          <button
            onClick={() => onModeChange('hours')}
            className={`
              text-5xl font-semibold tracking-tight
              clock-transition
              ${mode === 'hours' 
                ? 'text-foreground' 
                : 'text-muted-foreground hover:text-foreground/80'
              }
            `}
          >
            {displayHours.toString().padStart(2, '0')}
          </button>
          <span className="text-5xl font-semibold text-foreground mx-0.5">:</span>
          <button
            onClick={() => onModeChange('minutes')}
            className={`
              text-5xl font-semibold tracking-tight
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
        <div className="mt-2">
          <Clock className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
