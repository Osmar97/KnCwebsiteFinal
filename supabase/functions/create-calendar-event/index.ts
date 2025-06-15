
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarEventRequest {
  summary: string;
  description: string;
  startDateTime: string;
  attendeeEmail: string;
  attendeeName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      summary,
      description,
      startDateTime,
      attendeeEmail,
      attendeeName
    }: CalendarEventRequest = await req.json();

    console.log("Creating calendar event:", {
      summary,
      description,
      startDateTime,
      attendeeEmail,
      attendeeName
    });

    // Get access token and calendar IDs from environment
    const accessToken = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN");
    const primaryCalendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";
    const checkCalendarIds = Deno.env.get("GOOGLE_CALENDAR_CHECK_IDS");

    if (!accessToken) {
      throw new Error("Google Calendar access token not configured");
    }

    // Create end time (1 hour after start)
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

    // Parse the calendar IDs to check (comma-separated)
    const calendarsToCheck = checkCalendarIds ? checkCalendarIds.split(',').map(id => id.trim()) : [];
    
    console.log("Checking availability across calendars:", calendarsToCheck);

    // Check availability across all specified calendars
    for (const calendarId of calendarsToCheck) {
      console.log(`Checking calendar: ${calendarId}`);
      
      const freeBusyResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/freeBusy`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            items: [{ id: calendarId }]
          })
        }
      );

      if (!freeBusyResponse.ok) {
        const errorText = await freeBusyResponse.text();
        console.error(`Error checking calendar ${calendarId}:`, freeBusyResponse.status, errorText);
        throw new Error(`Error checking calendar availability: ${freeBusyResponse.status} - ${errorText}`);
      }

      const freeBusyData = await freeBusyResponse.json();
      const busyTimes = freeBusyData.calendars[calendarId]?.busy || [];

      if (busyTimes.length > 0) {
        console.log(`Calendar ${calendarId} has conflicts:`, busyTimes);
        throw new Error(`Time slot is not available. There is a conflict in one of your calendars.`);
      }
    }

    console.log("All calendars are available for the requested time slot");

    // Create the event on the primary calendar
    const eventData = {
      summary,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Europe/Lisbon"
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Europe/Lisbon"
      },
      attendees: [
        {
          email: attendeeEmail,
          displayName: attendeeName,
          responseStatus: "needsAction"
        }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 24 hours before
          { method: "popup", minutes: 30 } // 30 minutes before
        ]
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          }
        }
      }
    };

    console.log("Creating event on primary calendar:", primaryCalendarId);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${primaryCalendarId}/events?conferenceDataVersion=1`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Calendar API error:", response.status, errorText);
      throw new Error(`Google Calendar API error: ${response.status} - ${errorText}`);
    }

    const event = await response.json();
    console.log("Calendar event created successfully:", event);

    return new Response(
      JSON.stringify({
        success: true,
        eventId: event.id,
        eventLink: event.htmlLink,
        meetingLink: event.conferenceData?.entryPoints?.[0]?.uri,
        message: "Event created successfully after checking availability across all calendars"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error: any) {
    console.error("Error creating calendar event:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

serve(handler);
