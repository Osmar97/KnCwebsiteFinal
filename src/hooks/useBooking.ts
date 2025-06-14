
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingData {
  name: string;
  email: string;
  company: string;
  phone: string;
  selectedDate: Date;
  selectedTime: string;
}

export const useBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createCalendarEvent = async (bookingData: BookingData) => {
    try {
      console.log("Creating calendar event:", bookingData);

      const { data, error } = await supabase.functions.invoke('create-calendar-event', {
        body: {
          summary: `Consultation Call with ${bookingData.name}`,
          description: `Company: ${bookingData.company}\nPhone: ${bookingData.phone}\nEmail: ${bookingData.email}`,
          startDateTime: new Date(
            bookingData.selectedDate.getFullYear(),
            bookingData.selectedDate.getMonth(),
            bookingData.selectedDate.getDate(),
            parseInt(bookingData.selectedTime.split(':')[0]),
            parseInt(bookingData.selectedTime.split(':')[1])
          ).toISOString(),
          attendeeEmail: bookingData.email,
          attendeeName: bookingData.name
        }
      });

      if (error) {
        throw error;
      }

      console.log("Calendar event created successfully:", data);
      return data;
    } catch (error: any) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  };

  const submitBooking = async (bookingData: BookingData) => {
    setIsSubmitting(true);

    try {
      await createCalendarEvent(bookingData);

      toast({
        title: "Booking Confirmed!",
        description: "Your call has been scheduled and you'll receive a calendar invitation shortly.",
      });

      return true;
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error scheduling your call. Please try again or contact us directly.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitBooking
  };
};
