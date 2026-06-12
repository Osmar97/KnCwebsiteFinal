import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENT = "services@kingsncompany.com";
const FROM = "Kings & Company <onboarding@resend.dev>";

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full Name",
  email: "Email",
  whatsapp: "WhatsApp Number",
  joining: "Who is joining",
  joiningOther: "Joining (other)",
  successGoal: "What would make this tour successful",
  priorities: "Top priorities",
  specificAreas: "Specific areas / properties",
  budget: "Approximate budget",
  propertyTypes: "Preferred property types",
  logistics: "Help needed with",
  pace: "Pace preference",
  dietary: "Dietary / accessibility",
  notes: "Anything else",
  formType: "Form type",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildHtml(data: Record<string, unknown>) {
  const rows = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const raw = (data as Record<string, unknown>)[key];
      const value = Array.isArray(raw) ? raw.join(", ") : (raw ? String(raw) : "");
      if (!value) return "";
      return `<tr>
        <td style="padding:8px 12px;background:#f7f5f0;font-weight:600;vertical-align:top;width:220px;border-bottom:1px solid #eee;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`;
    })
    .join("");
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222;background:#fff;padding:24px;">
    <h2 style="margin:0 0 16px;">Private Property Tour — New Enquiry</h2>
    <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #eee;">${rows}</table>
  </body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const data = await req.json();
    const fullName = String(data?.fullName || "Unknown").slice(0, 120);
    if (!data?.email || !data?.fullName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist the submission to the database for the admin inbox.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const formType: string = String(data?.formType || "enquiry");
    let storedId: string | null = null;
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const raw = (data?.raw ?? data) as Record<string, unknown>;
      const arr = (v: unknown) => Array.isArray(v) ? v.map(String) : [];
      try {
        if (formType === "private") {
          const { data: row, error } = await supabase
            .from("tour_custom_quote_requests")
            .insert({
              first_name: String(raw.first_name ?? fullName.split(" ")[0] ?? "Unknown"),
              last_name: String(raw.last_name ?? fullName.split(" ").slice(1).join(" ") ?? ""),
              email: String(data.email).slice(0, 320),
              phone: raw.whatsapp ? String(raw.whatsapp) : null,
              country: raw.country ? String(raw.country) : null,
              nationality: raw.nationality ? String(raw.nationality) : null,
              num_guests: raw.guests ? Number(raw.guests) : null,
              num_days: raw.days ? Number(raw.days) : null,
              preferred_dates: [raw.date1, raw.date2].filter(Boolean).map(String).join(" / ") || null,
              destinations: raw.destination ? [String(raw.destination)] : [],
              vibes: arr(raw.vibes),
              hotel_preference: raw.hotel ? String(raw.hotel) : null,
              extras_slugs: arr(raw.extras ?? raw.services),
              notes: raw.notes_extra ? String(raw.notes_extra) : (data.notes ? String(data.notes) : null),
              payload: data,
            })
            .select("id")
            .single();
          if (error) console.error("Insert custom quote failed:", error);
          else storedId = (row as { id: string }).id;
        } else if (formType === "waitlist") {
          const { data: row, error } = await supabase
            .from("tour_waitlist_requests")
            .insert({
              full_name: fullName,
              email: String(data.email).slice(0, 320),
              phone: raw.whatsapp ? String(raw.whatsapp) : null,
              country: raw.country ? String(raw.country) : null,
              preferred_destinations: raw.destination ? [String(raw.destination)] : [],
              vibes: arr(raw.vibes),
              notes: raw.notes_extra ? String(raw.notes_extra) : (data.notes ? String(data.notes) : null),
              payload: data,
            })
            .select("id")
            .single();
          if (error) console.error("Insert waitlist failed:", error);
          else storedId = (row as { id: string }).id;
        }
      } catch (dbErr) {
        console.error("DB persistence error:", dbErr);
      }
    }

    const subjectPrefix =
      formType === "private" ? "Custom Quote Request"
      : formType === "waitlist" ? "Waitlist Request"
      : "Request private tour";
    const subject = `${fullName} - ${subjectPrefix}`;
    const html = buildHtml(data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [RECIPIENT],
        reply_to: String(data.email),
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend send failed:", res.status, errText);
      return new Response(JSON.stringify({ error: "Email send failed", details: errText }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: storedId }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});