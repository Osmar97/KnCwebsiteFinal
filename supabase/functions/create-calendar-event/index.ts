
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { CALENDAR_SLOT_DURATION_MS } from "../_shared/tour-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitize = (v: unknown, max: number): string =>
  typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";

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
  refresh_token?: string;
}

// Cache for access token with expiration
let tokenCache: {
  access_token: string;
  expires_at: number;
} | null = null;

const refreshGoogleToken = async (): Promise<{ access_token: string; expires_at: number }> => {
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
  console.log("Successfully refreshed Google access token, expires in:", tokenData.expires_in, "seconds");
  
  // Calculate expiration time (subtract 5 minutes for safety buffer)
  const expiresAt = Date.now() + (tokenData.expires_in - 300) * 1000;
  
  // Update cache
  tokenCache = {
    access_token: tokenData.access_token,
    expires_at: expiresAt
  };
  
  return tokenCache;
};

const getValidAccessToken = async (): Promise<string> => {
  const now = Date.now();
  
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expires_at > now) {
    console.log("Using cached access token, expires in:", Math.round((tokenCache.expires_at - now) / 1000), "seconds");
    return tokenCache.access_token;
  }
  
  console.log("Token expired or not cached, refreshing...");
  const tokenInfo = await refreshGoogleToken();
  return tokenInfo.access_token;
};

/**
 * Wraps a Google Calendar API call so that a 401 transparently triggers a
 * cache flush + token refresh and a single retry. Returns the final `Response`.
 */
const withTokenRetry = async (
  doFetch: (token: string) => Promise<Response>,
): Promise<Response> => {
  const token = await getValidAccessToken();
  const response = await doFetch(token);
  if (response.status !== 401) return response;

  console.log("401 from Google — clearing token cache and retrying once...");
  tokenCache = null;
  const newToken = await getValidAccessToken();
  return doFetch(newToken);
};

interface BusyInterval { start: string; end: string }

/** Returns the list of busy intervals for a single calendar in [start, end]. */
const fetchBusyTimes = async (
  calendarId: string,
  startDate: Date,
  endDate: Date,
): Promise<BusyInterval[]> => {
  const response = await withTokenRetry((token) =>
    fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
      }),
    }),
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error checking calendar ${calendarId}:`, response.status, errorText);
    throw new Error(`Error checking calendar availability: ${response.status} - ${errorText}`);
  }

  const freeBusyData = await response.json();
  return freeBusyData.calendars[calendarId]?.busy ?? [];
};

/** Returns the first conflicting interval, or null if the slot is free. */
const findConflict = (
  busyTimes: BusyInterval[],
  startDate: Date,
  endDate: Date,
): BusyInterval | null => {
  for (const busyTime of busyTimes) {
    const busyStart = new Date(busyTime.start);
    const busyEnd = new Date(busyTime.end);
    if (startDate < busyEnd && endDate > busyStart) return busyTime;
  }
  return null;
};

const unavailableResponse = () =>
  new Response(
    JSON.stringify({ success: false, available: false, message: "Time slot is not available" }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
  );

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

    // Validate and sanitize all caller-provided fields before contacting Google.
    const cleanSummary = sanitize(summary, 200);
    const cleanDescription = sanitize(description, 2000);
    const cleanAttendeeName = sanitize(attendeeName, 100);
    const cleanAttendeeEmail = sanitize(attendeeEmail, 255);
    const startDateParsed = new Date(startDateTime);
    const now = Date.now();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    if (
      !cleanSummary ||
      !cleanAttendeeName ||
      !EMAIL_RE.test(cleanAttendeeEmail) ||
      Number.isNaN(startDateParsed.getTime()) ||
      startDateParsed.getTime() < now - 60_000 ||
      startDateParsed.getTime() > now + oneYearMs
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid booking payload" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    console.log(checkOnly ? "=== AVAILABILITY CHECK ===" : "=== ACTUAL BOOKING REQUEST ===");

    const primaryCalendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";
    const checkCalendarIds = Deno.env.get("GOOGLE_CALENDAR_CHECK_IDS");

    // Booking slot window (constant duration shared with the rest of the app).
    const startDate = startDateParsed;
    const endDate = new Date(startDate.getTime() + CALENDAR_SLOT_DURATION_MS);

    const calendarsToCheck = checkCalendarIds ? checkCalendarIds.split(',').map(id => id.trim()) : [];

    console.log("Checking availability across calendars:", calendarsToCheck);
    console.log("Requested time slot:", {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    });

    // Check availability across all specified calendars (any overlap blocks).
    for (const calendarId of calendarsToCheck) {
      console.log(`Checking calendar: ${calendarId}`);
      const busyTimes = await fetchBusyTimes(calendarId, startDate, endDate);
      console.log(`Calendar ${calendarId} busy times:`, busyTimes);

      const conflict = findConflict(busyTimes, startDate, endDate);
      if (conflict) {
        console.log(`Found conflict in calendar ${calendarId}:`, {
          busyPeriod: { start: conflict.start, end: conflict.end },
          requestedSlot: { start: startDate.toISOString(), end: endDate.toISOString() },
        });
        if (checkOnly) return unavailableResponse();
        throw new Error("Time slot is not available. There is a conflict with an existing appointment.");
      }
    }

    console.log("All calendars are available for the requested time slot");

    // If this is just an availability check, return success
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
    console.log("=== CREATING CALENDAR EVENT ===");
    console.log("Creating event on primary calendar:", primaryCalendarId);

    const eventData = {
      summary: cleanSummary,
      description: cleanDescription,
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
          email: cleanAttendeeEmail,
          displayName: cleanAttendeeName,
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

    console.log("Event data to be created:", eventData);

    const response = await withTokenRetry((token) =>
      fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${primaryCalendarId}/events?conferenceDataVersion=1`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        },
      ),
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Calendar API error:", response.status, errorText);
      throw new Error(`Google Calendar API error: ${response.status} - ${errorText}`);
    }

    const event = await response.json();
    console.log("=== CALENDAR EVENT CREATED SUCCESSFULLY ===");
    console.log("Created event:", event);

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
    console.error("=== ERROR IN CALENDAR FUNCTION ===");
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
