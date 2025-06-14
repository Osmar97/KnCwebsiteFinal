
import { Button } from "@/components/ui/button";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSlotPicker = ({ selectedDate, selectedTime, onTimeSelect }: TimeSlotPickerProps) => {
  // Generate time slots from 14:00 to 20:00 (2 PM to 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 14; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
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

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-center">Available Times</h3>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? "default" : "outline"}
            size="sm"
            onClick={() => onTimeSelect(time)}
            className={selectedTime === time ? "bg-gold hover:bg-gold-dark text-black" : ""}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
