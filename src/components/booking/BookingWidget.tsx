
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingFormFields from "@/components/BookingFormFields";
import { useBooking } from "@/hooks/useBooking";
import MeetingDetails from "./MeetingDetails";

interface BookingWidgetProps {}

const BookingWidget = ({}: BookingWidgetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });

  const { isSubmitting, submitBooking } = useBooking();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.company && selectedDate && selectedTime;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const success = await submitBooking({
      ...formData,
      selectedDate: selectedDate!,
      selectedTime
    });

    if (success) {
      // Reset form
      setFormData({ name: "", email: "", company: "", phone: "" });
      setSelectedTime("");
      setSelectedDate(new Date());
    }
  };

  // Filter out weekends and past dates
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable weekends (Sunday = 0, Saturday = 6) and past dates
    return day === 0 || day === 6 || date < today;
  };

  return (
    <div className="bg-white text-black rounded-2xl p-6 shadow-2xl">
      {/* Meeting Details */}
      <MeetingDetails />

      {/* Calendar */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-center">Select a Date</h3>
        <div className="flex justify-center">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            className="w-auto"
          />
        </div>
      </div>

      {/* Time Slots */}
      <div className="mb-6">
        <TimeSlotPicker 
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />
      </div>

      {/* Booking Form */}
      <BookingFormFields
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isFormValid={!!isFormValid}
      />
    </div>
  );
};

export default BookingWidget;
