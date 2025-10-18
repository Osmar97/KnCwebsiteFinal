import { useTimeSlotAvailability } from "@/hooks/useTimeSlotAvailability";

interface TimeSlotPickerProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSlotPicker = ({ selectedDate, selectedTime, onTimeSelect }: TimeSlotPickerProps) => {
  const { availability, isLoading } = useTimeSlotAvailability(selectedDate);
  
  // Convert availability object to array of available slots
  const availableSlots = Object.entries(availability)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([time]) => time);

  if (!selectedDate) {
    return (
      <div className="text-center text-gray-500 py-4">
        Please select a date first
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-4">
        Loading available times...
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No available time slots for this date
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-medium mb-3 text-center">Select a Time</h3>
      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {availableSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => onTimeSelect(slot)}
            className={`py-2 px-4 rounded-lg text-sm transition-colors ${
              selectedTime === slot
                ? "bg-gold text-black font-medium"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
