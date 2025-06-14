
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

    // Get access token from environment
    const accessToken = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN");
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";

    if (!accessToken) {
      throw new Error("Google Calendar access token not configured");
    }

    // Create end time (1 hour after start)
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

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

    console.log("Sending event data to Google Calendar:", eventData);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?conferenceDataVersion=1`,
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
        meetingLink: event.conferenceData?.entryPoints?.[0]?.uri
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
