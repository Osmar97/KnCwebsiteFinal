import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { withRateLimit, corsHeaders } from "../_shared/rate-limiter.ts";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const handler = async (req: Request): Promise<Response> => {
  try {
    const reqBody = await req.json();
    const { origin, preTourData } = reqBody;

    // Flatten + truncate metadata (Stripe limits: 50 keys, 500 chars per value)
    const metadata: Record<string, string> = {};
    if (preTourData && typeof preTourData === "object") {
      for (const [k, v] of Object.entries(preTourData)) {
        const value = Array.isArray(v) ? v.join(", ") : String(v ?? "");
        if (value) metadata[k] = value.slice(0, 500);
      }
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: preTourData?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Property Ownership Tour',
              description: 'All-inclusive of hotel, meals, sessions, tours, and consultation. (Includes €1,000 deposit)',
            },
            unit_amount: 350000, // €3,500 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata,
      success_url: `${origin || 'http://localhost:5173'}/tour?success=true`,
      cancel_url: `${origin || 'http://localhost:5173'}/tour?canceled=true`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating stripe session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};

serve((req) => withRateLimit(req, handler));
