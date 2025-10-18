
import { Button } from "@/components/ui/button";
import { useTimeSlotAvailability } from "@/hooks/useTimeSlotAvailability";
import { Loader2 } from "lucide-react";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSlotPicker = ({ selectedDate, selectedTime, onTimeSelect }: TimeSlotPickerProps) => {
  const { availability, isLoading } = useTimeSlotAvailability(selectedDate);

  // Generate time slots from 14:00 to 20:00 (2 PM to 8 PM) in 15-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 14; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:15`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
      slots.push(`${hour.toString().padStart(2, '0')}:45`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if selected date is a weekday (Monday-Friday)
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // 1 = Monday, 5 = Friday
  };

  // Check if selected date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (!selectedDate) {
    return (
      <div className="text-center text-gray-500 py-4">
        Please select a date first
      </div>
    );
  }

  if (!isWeekday(selectedDate)) {
    return (
      <div className="text-center text-gray-500 py-4">
        Appointments are only available Monday through Friday
      </div>
    );
  }

  if (isPastDate(selectedDate)) {
    return (
      <div className="text-center text-gray-500 py-4">
        Please select a future date
      </div>
    );
  }

  // Filter to only show available time slots
  const availableTimeSlots = timeSlots.filter(time => availability[time] === true);

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-center">Available Times</h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
          <span className="ml-2 text-gray-500">Checking availability...</span>
        </div>
      ) : availableTimeSlots.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No available time slots for this date
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {availableTimeSlots.map((time) => {
            const isSelected = selectedTime === time;
            
            return (
              <Button
                key={time}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onTimeSelect(time)}
                className={`
                  text-xs
                  ${isSelected ? "bg-gold hover:bg-gold-dark text-black" : "hover:border-gold hover:text-gold"}
                `}
              >
                {time}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
