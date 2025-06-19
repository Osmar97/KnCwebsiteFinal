
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

    if (checkOnly) {
      console.log("=== AVAILABILITY CHECK ===");
    } else {
      console.log("=== ACTUAL BOOKING REQUEST ===");
    }

    console.log("Processing calendar request:", {
      summary,
      description,
      startDateTime,
      attendeeEmail,
      attendeeName,
      checkOnly
    });

    // Get a valid access token (use cached if available, refresh if needed)
    const accessToken = await getValidAccessToken();
    
    const primaryCalendarId = Deno.env.get("GOOGLE_CALENDAR_ID") || "primary";
    const checkCalendarIds = Deno.env.get("GOOGLE_CALENDAR_CHECK_IDS");

    // Create start and end times for the booking (20 minute duration)
    const startDate = new Date(startDateTime);
    const endDate = new Date(startDate.getTime() + 20 * 60 * 1000); // Add 20 minutes

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
      
      // Check for conflicts in the exact time window
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
        
        if (freeBusyResponse.status === 401) {
          // Clear cache and try once more with fresh token
          console.log("Token seems invalid, clearing cache and retrying...");
          tokenCache = null;
          const newAccessToken = await getValidAccessToken();
          
          const retryResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/freeBusy`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${newAccessToken}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                timeMin: startDate.toISOString(),
                timeMax: endDate.toISOString(),
                items: [{ id: calendarId }]
              })
            }
          );
          
          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text();
            throw new Error(`Authentication failed even after token refresh. Please check that your Google OAuth credentials and refresh token are valid. Error: ${retryResponse.status} - ${retryErrorText}`);
          }
          
          const freeBusyData = await retryResponse.json();
          const busyTimes = freeBusyData.calendars[calendarId]?.busy || [];
          console.log(`Calendar ${calendarId} busy times (after retry):`, busyTimes);
          
          // Check for overlaps with retry response
          for (const busyTime of busyTimes) {
            const busyStart = new Date(busyTime.start);
            const busyEnd = new Date(busyTime.end);
            
            const hasOverlap = startDate < busyEnd && endDate > busyStart;
            
            if (hasOverlap) {
              console.log(`Found conflict in calendar ${calendarId}:`, {
                busyPeriod: { start: busyStart.toISOString(), end: busyEnd.toISOString() },
                requestedSlot: { start: startDate.toISOString(), end: endDate.toISOString() }
              });
              
              if (checkOnly) {
                console.log("Returning unavailable for availability check");
                return new Response(
                  JSON.stringify({
                    success: false,
                    available: false,
                    message: "Time slot is not available"
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
              
              console.log("Blocking actual booking due to conflict");
              throw new Error(`Time slot is not available. There is a conflict with an existing appointment.`);
            }
          }
          
          continue; // Continue to next calendar
        }
        
        throw new Error(`Error checking calendar availability: ${freeBusyResponse.status} - ${errorText}`);
      }

      const freeBusyData = await freeBusyResponse.json();
      const busyTimes = freeBusyData.calendars[calendarId]?.busy || [];

      console.log(`Calendar ${calendarId} busy times:`, busyTimes);

      // Check for any overlaps - ANY overlap should block the slot
      for (const busyTime of busyTimes) {
        const busyStart = new Date(busyTime.start);
        const busyEnd = new Date(busyTime.end);
        
        // Check if there's any overlap between the requested slot and the busy time
        const hasOverlap = startDate < busyEnd && endDate > busyStart;
        
        if (hasOverlap) {
          console.log(`Found conflict in calendar ${calendarId}:`, {
            busyPeriod: { start: busyStart.toISOString(), end: busyEnd.toISOString() },
            requestedSlot: { start: startDate.toISOString(), end: endDate.toISOString() }
          });
          
          // If this is just an availability check, return that it's not available
          if (checkOnly) {
            console.log("Returning unavailable for availability check");
            return new Response(
              JSON.stringify({
                success: false,
                available: false,
                message: "Time slot is not available"
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
          
          // If this is an actual booking attempt, throw an error
          console.log("Blocking actual booking due to conflict");
          throw new Error(`Time slot is not available. There is a conflict with an existing appointment.`);
        }
      }
    }

    console.log("All calendars are available for the requested time slot");

    // If this is just an availability check, return success
    if (checkOnly) {
      console.log("Returning available for availability check");
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

    console.log("Event data to be created:", eventData);

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
      
      // If it's an auth error, try once more with fresh token
      if (response.status === 401) {
        console.log("Auth error on event creation, trying with fresh token...");
        tokenCache = null;
        const newAccessToken = await getValidAccessToken();
        
        const retryResponse = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${primaryCalendarId}/events?conferenceDataVersion=1`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${newAccessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
          }
        );
        
        if (!retryResponse.ok) {
          const retryErrorText = await retryResponse.text();
          throw new Error(`Google Calendar API error after retry: ${retryResponse.status} - ${retryErrorText}`);
        }
        
        const event = await retryResponse.json();
        console.log("=== CALENDAR EVENT CREATED SUCCESSFULLY (after retry) ===");
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
      }
      
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
