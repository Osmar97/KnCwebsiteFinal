
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, startDate, endDate, bookingData } = await req.json();

    if (action === 'getAvailability') {
      return await getAvailability(startDate, endDate);
    } else if (action === 'createBooking') {
      return await createBooking(bookingData);
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in booking function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

async function getAvailability(startDate: string, endDate: string) {
  try {
    // Fetch existing bookings from our database
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('selected_datetime')
      .gte('selected_datetime', startDate)
      .lte('selected_datetime', endDate)
      .eq('status', 'confirmed');

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    // Generate available time slots (9 AM to 6 PM, Monday to Friday)
    const availableSlots = generateAvailableSlots(startDate, endDate, bookings || []);

    return new Response(
      JSON.stringify({ availableSlots }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting availability:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function createBooking(bookingData: any) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true, booking: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function generateAvailableSlots(startDate: string, endDate: string, bookings: any[]) {
  const slots = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const current = new Date(start);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    
    // Only Monday (1) to Friday (5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Generate hourly slots from 9 AM to 6 PM Lisbon time
      for (let hour = 9; hour < 18; hour++) {
        const slotStart = new Date(current);
        slotStart.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1, 0, 0, 0);
        
        // Check if slot conflicts with existing bookings
        const isBookingBusy = bookings.some(booking => {
          const bookingTime = new Date(booking.selected_datetime);
          const bookingEnd = new Date(bookingTime.getTime() + 60 * 60 * 1000); // 1 hour
          return slotStart < bookingEnd && slotEnd > bookingTime;
        });
        
        if (!isBookingBusy) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            title: `Available: ${slotStart.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              timeZone: 'Europe/Lisbon'
            })} - ${slotEnd.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              timeZone: 'Europe/Lisbon'
            })}`
          });
        }
      }
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return slots;
}

serve(handler);
