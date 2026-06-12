import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/rate-limiter.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const ALLOWED_ORIGINS = [
  "https://kingsncompany.com",
  "https://www.kingsncompany.com",
  "https://kings-website-copycat-project.lovable.app",
  "https://id-preview--d0f29916-ee33-49cf-a306-bc61ed7dbf99.lovable.app",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const {
      requestId,
      depositAmount,
      totalAmount,
      currency = "EUR",
      customerEmail,
      customerName,
      destinationLabel,
      days,
      persons,
      startDateLabel,
      origin,
    } = body;

    if (!requestId || !depositAmount || !customerEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeOrigin = typeof origin === "string" && ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: String(customerEmail),
      line_items: [
        {
          price_data: {
            currency: String(currency).toLowerCase(),
            product_data: {
              name: `Private Property Tour Deposit — ${destinationLabel ?? ""}`.trim(),
              description: `${days ?? ""}-day tour for ${persons ?? ""} ${
                Number(persons) === 1 ? "person" : "people"
              }${startDateLabel ? ` starting ${startDateLabel}` : ""}. 30% deposit of ${totalAmount} ${currency}; balance due 14 days before tour.`,
            },
            unit_amount: Math.round(Number(depositAmount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        request_id: String(requestId),
        customer_name: String(customerName ?? "").slice(0, 500),
        destination: String(destinationLabel ?? "").slice(0, 500),
        days: String(days ?? ""),
        persons: String(persons ?? ""),
        start_date: String(startDateLabel ?? "").slice(0, 500),
        total_amount: String(totalAmount ?? ""),
        deposit_amount: String(depositAmount),
        booking_type: "private_tour",
      },
      success_url: `${safeOrigin}/POT?booking=success&request=${requestId}#private`,
      cancel_url: `${safeOrigin}/POT?booking=cancelled&request=${requestId}#private`,
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase
        .from("tour_custom_quote_requests")
        .update({ stripe_session_id: session.id })
        .eq("id", requestId);
    }

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-private-tour-checkout error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});