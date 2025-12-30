import React from 'react';

interface ClockDialProps {
  mode: 'hours' | 'minutes';
  selectedValue: number;
  onSelect: (value: number) => void;
}

const ClockDial: React.FC<ClockDialProps> = ({ mode, selectedValue, onSelect }) => {
  // Generate clock numbers based on mode
  const numbers = mode === 'hours' 
    ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // Calculate the angle for the clock hand
  const getHandAngle = (): number => {
    if (mode === 'hours') {
      return (selectedValue % 12) * 30 - 90; // 30 degrees per hour
    }
    return (selectedValue / 60) * 360 - 90; // Full circle for minutes
  };

  // Calculate position for each number on the dial
  const getNumberPosition = (index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180); // 30 degrees per position
    const radius = 42; // Percentage from center
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  // Check if a number is selected
  const isSelected = (value: number): boolean => {
    if (mode === 'hours') {
      return selectedValue === value || (selectedValue === 0 && value === 12);
    }
    return selectedValue === value;
  };

  // Handle click on a number
  const handleNumberClick = (value: number) => {
    if (mode === 'hours') {
      onSelect(value === 12 ? 0 : value);
    } else {
      onSelect(value);
    }
  };

  // Calculate hand end position
  const handAngle = getHandAngle();
  const handLength = 32;
  const handEndX = 50 + handLength * Math.cos(handAngle * (Math.PI / 180));
  const handEndY = 50 + handLength * Math.sin(handAngle * (Math.PI / 180));

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Clock dial background */}
      <div className="absolute inset-0 rounded-full bg-clock-dial" />
      
      {/* Clock hand */}
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Hand line */}
        <line
          x1="50"
          y1="50"
          x2={handEndX}
          y2={handEndY}
          stroke="hsl(var(--clock-hand))"
          strokeWidth="1.5"
          className="clock-hand-transition"
        />
        
        {/* Center dot */}
        <circle
          cx="50"
          cy="50"
          r="3"
          fill="hsl(var(--clock-center))"
        />
        
        {/* End dot */}
        <circle
          cx={handEndX}
          cy={handEndY}
          r="2.5"
          fill="hsl(var(--clock-hand))"
          className="clock-hand-transition"
        />
      </svg>

      {/* Clock numbers */}
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

export default ClockDial;
