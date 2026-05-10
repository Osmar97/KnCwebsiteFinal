import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

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
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildEmailHtml(meta: Record<string, string>, amount: string, sessionId: string) {
  const rows = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const value = meta[key];
      if (!value) return "";
      return `<tr>
        <td style="padding:8px 12px;background:#f7f5f0;font-weight:600;vertical-align:top;width:220px;border-bottom:1px solid #eee;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222;background:#fff;padding:24px;">
    <h2 style="margin:0 0 8px;">Property Ownership Tour — New Booking</h2>
    <p style="margin:0 0 16px;color:#555;">Payment confirmed: <strong>${escapeHtml(amount)}</strong></p>
    <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #eee;">${rows}</table>
    <p style="color:#999;font-size:12px;margin-top:24px;">Stripe session: ${escapeHtml(sessionId)}</p>
  </body></html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const resendKey = Deno.env.get("RESEND_API_KEY");

  if (!signature || !webhookSecret) {
    console.error("Missing stripe signature or webhook secret");
    return new Response("Configuration error", { status: 400 });
  }
  if (!resendKey) {
    console.error("RESEND_API_KEY not configured");
    return new Response("Email not configured", { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = (session.metadata || {}) as Record<string, string>;
  const fullName = metadata.fullName || "Unknown";
  const amount = session.amount_total
    ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency || "eur").toUpperCase()}`
    : "N/A";

  const subject = `POT - ${fullName} - payment`;
  const html = buildEmailHtml(metadata, amount, session.id);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [RECIPIENT],
        reply_to: session.customer_email || metadata.email || undefined,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend send failed:", res.status, errText);
      return new Response(JSON.stringify({ error: "Email send failed", details: errText }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("POT booking email sent for session", session.id);
    return new Response(JSON.stringify({ received: true, emailed: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

serve(handler);