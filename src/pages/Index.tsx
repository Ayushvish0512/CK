import React, { useState } from 'react';
import { TimePicker } from '@/components/TimePicker';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleApply = (hours: number, minutes: number, period: 'AM' | 'PM') => {
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    setSelectedTime(timeString);
    
    toast({
      title: "Time Selected",
      description: `You picked ${timeString}`,
    });
  };

  const handleCancel = () => {
    toast({
      title: "Cancelled",
      description: "Time selection was cancelled",
      variant: "destructive",
    });
  };

  return (
    <main className="min-h-screen bg-secondary/50 flex flex-col items-center justify-center p-6">
      {/* Page heading */}
      <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
        Pick your time
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        Select hours and minutes using the circular dial
      </p>

      {/* Time Picker component */}
      <TimePicker
        initialHours={7}
        initialMinutes={0}
        initialPeriod="AM"
        onApply={handleApply}
        onCancel={handleCancel}
      />

      {/* Selected time display */}
      {selectedTime && (
        <div className="mt-8 text-center animate-scale-in">
          <p className="text-sm text-muted-foreground mb-1">Selected Time</p>
          <p className="text-2xl font-semibold text-primary">{selectedTime}</p>
        </div>
      )}
    </main>
  );
};

export default Index;
