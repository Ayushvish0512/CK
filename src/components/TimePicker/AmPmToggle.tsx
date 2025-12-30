import React from 'react';

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

export default AmPmToggle;
