import React from 'react';
import { addDays, addWeeks, format } from 'date-fns';

interface QuickSelectProps {
  selected: 'today' | 'tomorrow' | 'nextWeek' | 'month' | null;
  onSelect: (option: 'today' | 'tomorrow' | 'nextWeek' | 'month') => void;
}

const QuickSelect: React.FC<QuickSelectProps> = ({ selected, onSelect }) => {
  const options: { key: 'today' | 'tomorrow' | 'nextWeek' | 'month'; label: string }[] = [
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

export default QuickSelect;
