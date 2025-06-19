
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
      console.log("=== BOOKING PROCESS STARTED ===");
      console.log("Creating calendar event with data:", bookingData);

      const startDateTime = new Date(
        bookingData.selectedDate.getFullYear(),
        bookingData.selectedDate.getMonth(),
        bookingData.selectedDate.getDate(),
        parseInt(bookingData.selectedTime.split(':')[0]),
        parseInt(bookingData.selectedTime.split(':')[1])
      ).toISOString();

      console.log("Calculated start date time:", startDateTime);

      const description = `Phone: ${bookingData.phone}\nEmail: ${bookingData.email}`;

      const requestPayload = {
        summary: `Discovery Call with ${bookingData.name}`,
        description,
        startDateTime,
        attendeeEmail: bookingData.email,
        attendeeName: bookingData.name,
        checkOnly: false // This is actual booking, not just checking
      };

      console.log("Sending request to create-calendar-event with payload:", requestPayload);

      const { data, error } = await supabase.functions.invoke('create-calendar-event', {
        body: requestPayload
      });

      console.log("Response from create-calendar-event:", { data, error });

      if (error) {
        console.error("Error from Supabase function:", error);
        throw error;
      }

      if (data && !data.success) {
        console.error("Function returned unsuccessful response:", data);
        throw new Error(data.error || "Unknown error occurred");
      }

      console.log("=== BOOKING SUCCESSFUL ===");
      console.log("Calendar event created successfully:", data);
      return data;
    } catch (error: any) {
      console.error("=== BOOKING FAILED ===");
      console.error("Error creating calendar event:", error);
      throw error;
    }
  };

  const submitBooking = async (bookingData: BookingData) => {
    console.log("=== SUBMIT BOOKING CALLED ===");
    console.log("Booking data received:", bookingData);
    
    setIsSubmitting(true);

    try {
      await createCalendarEvent(bookingData);

      console.log("Booking completed successfully, showing success toast");
      toast({
        title: "Discovery Call Booked!",
        description: "Your call has been scheduled and you'll receive a calendar invitation shortly.",
      });

      return true;
    } catch (error: any) {
      console.error("Error in submitBooking:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error scheduling your call. Please try again or contact us directly.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
      console.log("=== BOOKING PROCESS ENDED ===");
    }
  };

  return {
    isSubmitting,
    submitBooking
  };
};
