
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
      const startDateTime = new Date(
        bookingData.selectedDate.getFullYear(),
        bookingData.selectedDate.getMonth(),
        bookingData.selectedDate.getDate(),
        parseInt(bookingData.selectedTime.split(':')[0]),
        parseInt(bookingData.selectedTime.split(':')[1])
      ).toISOString();

      const description = `Phone: ${bookingData.phone}\nEmail: ${bookingData.email}`;

      const requestPayload = {
        summary: `Discovery Call with ${bookingData.name}`,
        description,
        startDateTime,
        attendeeEmail: bookingData.email,
        attendeeName: bookingData.name,
        checkOnly: false // This is actual booking, not just checking
      };

      const { data, error } = await supabase.functions.invoke('create-calendar-event', {
        body: requestPayload
      });

      if (error) {
        console.error("Error from Supabase function:", error);
        throw error;
      }

      if (data && !data.success) {
        console.error("Function returned unsuccessful response:", data);
        throw new Error(data.error || "Unknown error occurred");
      }

      return data;
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw error;
    }
  };

  const submitBooking = async (bookingData: BookingData) => {
    setIsSubmitting(true);

    try {
      await createCalendarEvent(bookingData);

      toast({
        title: "Discovery Call Booked!",
        description: "Your call has been scheduled and you'll receive a calendar invitation shortly.",
      });

      return true;
    } catch (error) {
      console.error("Error in submitBooking:", error);
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
