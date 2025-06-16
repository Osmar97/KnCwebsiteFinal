
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlotAvailability {
  [time: string]: boolean;
}

export const useTimeSlotAvailability = (selectedDate: Date | undefined) => {
  const [availability, setAvailability] = useState<TimeSlotAvailability>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setAvailability({});
      return;
    }

    const checkAvailability = async () => {
      setIsLoading(true);
      try {
        // Generate time slots from 14:00 to 19:00
        const timeSlots = [];
        for (let hour = 14; hour < 20; hour++) {
          timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        const availabilityMap: TimeSlotAvailability = {};

        // Check each time slot
        for (const timeSlot of timeSlots) {
          try {
            const startDateTime = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(timeSlot.split(':')[0]),
              parseInt(timeSlot.split(':')[1])
            ).toISOString();

            const { data, error } = await supabase.functions.invoke('create-calendar-event', {
              body: {
                summary: "Availability Check",
                description: "Checking availability",
                startDateTime,
                attendeeEmail: "check@example.com",
                attendeeName: "Availability Check",
                checkOnly: true // Add a flag to only check availability
              }
            });

            if (error && error.message?.includes("Time slot is not available")) {
              availabilityMap[timeSlot] = false;
            } else {
              availabilityMap[timeSlot] = true;
            }
          } catch (err) {
            // If there's an error checking this slot, assume it's unavailable
            availabilityMap[timeSlot] = false;
          }
        }

        setAvailability(availabilityMap);
      } catch (error) {
        console.error("Error checking availability:", error);
        // If there's an error, assume all slots are available
        const timeSlots = [];
        for (let hour = 14; hour < 20; hour++) {
          timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        const fallbackAvailability: TimeSlotAvailability = {};
        timeSlots.forEach(slot => {
          fallbackAvailability[slot] = true;
        });
        setAvailability(fallbackAvailability);
      } finally {
        setIsLoading(false);
      }
    };

    checkAvailability();
  }, [selectedDate]);

  return { availability, isLoading };
};
