
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
  checkOnly?: boolean;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

const refreshGoogleToken = async (): Promise<string> => {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Google OAuth credentials. Please configure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in Supabase secrets.");
  }

  console.log("Refreshing Google access token...");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error refreshing token:", response.status, errorText);
    throw new Error(`Failed to refresh Google access token: ${response.status} - ${errorText}`);
  }

  const tokenData: TokenResponse = await response.json();
  console.log("Successfully refreshed Google access token");
  
  return tokenData.access_token;
};

const getValidAccessToken = async (): Promise<string> => {
  // First try the stored access token
  let accessToken = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN");
  
  if (!accessToken) {
    console.log("No stored access token, refreshing...");
    accessToken = await refreshGoogleToken();
  } else {
    // Test if the current token is still valid with a simple request
    const testResponse = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/settings/timezone",
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    if (testResponse.status === 401) {
      console.log("Stored access token expired, refreshing...");
      accessToken = await refreshGoogleToken();
    } else if (!testResponse.ok) {
      console.log("Token test failed with status:", testResponse.status);
      accessToken = await refreshGoogleToken();
    } else {
      console.log("Stored access token is still valid");
    }
  }

  return accessToken;
};

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
      attendeeName,
      checkOnly = false
    }: CalendarEventRequest = await req.json();

    console.log("Processing calendar request:", {
      summary,
      description,
      startDateTime,
      attendeeEmail,
      attendeeName,
      checkOnly
    });

    // Get a valid access token (refresh if needed)
    const accessToken = await getValidAccessToken();
    
    const primaryCalendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";
    const checkCalendarIds = Deno.env.get("GOOGLE_CALENDAR_CHECK_IDS");

    // Create start and end times for the booking (1 hour duration)
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

    // Parse the calendar IDs to check (comma-separated)
    const calendarsToCheck = checkCalendarIds ? checkCalendarIds.split(',').map(id => id.trim()) : [];
    
    console.log("Checking availability across calendars:", calendarsToCheck);
    console.log("Requested time slot:", {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    // Check availability across all specified calendars
    for (const calendarId of calendarsToCheck) {
      console.log(`Checking calendar: ${calendarId}`);
      
      // Use a wider time window to check for any overlapping events
      // Check 30 minutes before and after to catch overlapping appointments
      const checkStartTime = new Date(startDate.getTime() - 30 * 60 * 1000); // 30 minutes before
      const checkEndTime = new Date(endDate.getTime() + 30 * 60 * 1000); // 30 minutes after
      
      const freeBusyResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/freeBusy`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            timeMin: checkStartTime.toISOString(),
            timeMax: checkEndTime.toISOString(),
            items: [{ id: calendarId }]
          })
        }
      );

      if (!freeBusyResponse.ok) {
        const errorText = await freeBusyResponse.text();
        console.error(`Error checking calendar ${calendarId}:`, freeBusyResponse.status, errorText);
        
        // If it's still an authentication error after refresh, provide specific feedback
        if (freeBusyResponse.status === 401) {
          throw new Error(`Authentication failed even after token refresh. Please check that your Google OAuth credentials and refresh token are valid.`);
        }
        
        throw new Error(`Error checking calendar availability: ${freeBusyResponse.status} - ${errorText}`);
      }

      const freeBusyData = await freeBusyResponse.json();
      const busyTimes = freeBusyData.calendars[calendarId]?.busy || [];

      console.log(`Calendar ${calendarId} busy times:`, busyTimes);

      // Check if any busy time overlaps with our requested time slot
      for (const busyTime of busyTimes) {
        const busyStart = new Date(busyTime.start);
        const busyEnd = new Date(busyTime.end);
        
        // Check for overlap: busy period overlaps with our requested slot
        const hasOverlap = (busyStart < endDate) && (busyEnd > startDate);
        
        if (hasOverlap) {
          console.log(`Found conflict in calendar ${calendarId}:`, {
            busyPeriod: { start: busyStart.toISOString(), end: busyEnd.toISOString() },
            requestedSlot: { start: startDate.toISOString(), end: endDate.toISOString() }
          });
          throw new Error(`Time slot is not available. There is a conflict with an existing appointment from ${busyStart.toLocaleTimeString()} to ${busyEnd.toLocaleTimeString()}.`);
        }
      }
    }

    console.log("All calendars are available for the requested time slot");

    // If this is just an availability check, return success without creating the event
    if (checkOnly) {
      return new Response(
        JSON.stringify({
          success: true,
          available: true,
          message: "Time slot is available"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }

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
    console.error("Error processing calendar request:", error);
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
