
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
        // Generate time slots including 15-minute intervals
        const timeSlots = [];
        for (let hour = 14; hour < 20; hour++) {
          timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
          timeSlots.push(`${hour.toString().padStart(2, '0')}:15`);
          timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
          timeSlots.push(`${hour.toString().padStart(2, '0')}:45`);
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
                checkOnly: true
              }
            });

            // If the response indicates the slot is available, mark it as available
            // If there's an error or the slot is not available, mark it as unavailable
            if (data && data.available === true) {
              availabilityMap[timeSlot] = true;
            } else {
              availabilityMap[timeSlot] = false;
            }
          } catch (err) {
            // If there's an error checking this slot, assume it's unavailable
            console.warn(`Error checking slot ${timeSlot}:`, err);
            availabilityMap[timeSlot] = false;
          }
        }

        console.log("Final availability map:", availabilityMap);
        setAvailability(availabilityMap);
      } catch (error) {
        console.error("Error checking availability:", error);
        // If there's an error, assume all slots are unavailable as a safe fallback
        const timeSlots = [];
        for (let hour = 14; hour < 20; hour++) {
          timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
          timeSlots.push(`${hour.toString().padStart(2, '0')}:15`);
          timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
          timeSlots.push(`${hour.toString().padStart(2, '0')}:45`);
        }
        const fallbackAvailability: TimeSlotAvailability = {};
        timeSlots.forEach(slot => {
          fallbackAvailability[slot] = false;
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
