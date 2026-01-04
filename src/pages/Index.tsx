import React, { useState } from 'react';
import { format } from 'date-fns';
import DateTimePicker from '../components/DateTimePicker/DateTimePicker';
import { toast } from '../hooks/use-toast';

const Index: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleApply = (date: Date, hours: number, minutes: number, period: 'AM' | 'PM') => {
    setSelectedDate(date);
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    setSelectedTime(timeString);

    toast({
      title: "Date & Time Selected",
      description: `You picked ${format(date, 'EEEE, MMMM d, yyyy')} at ${timeString}`,
    });
  };

  const handleCancel = () => {
    toast({
      title: "Cancelled",
      description: "Selection was cancelled",
      variant: "destructive",
    });
  };

  return (
    <main className="min-h-screen gradient-bg flex flex-col items-center justify-start p-6 pt-12 gap-8">
      {/* Page heading */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Pick your date & time
        </h1>
        <p className="text-muted-foreground">
          Select a date and time using the picker below
        </p>
      </div>

      {/* Combined Date & Time Picker */}
      <DateTimePicker
        initialDate={selectedDate}
        initialHours={7}
        initialMinutes={0}
        initialPeriod="AM"
        onApply={handleApply}
        onCancel={handleCancel}
      />

      {/* Selected values display */}
      <div className="glass-card rounded-2xl p-6 shadow-glass animate-scale-in text-center">
        <p className="text-sm text-muted-foreground mb-2">Selected Date & Time</p>
        <p className="text-xl font-semibold text-foreground">
          {format(selectedDate, 'EEE, MMM d, yyyy')}
          {selectedTime && ` at ${selectedTime}`}
        </p>
      </div>
    </main>
  );
};

export default Index;
