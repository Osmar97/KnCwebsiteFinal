import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * LIGHTWEIGHT DB-BASED RATE LIMITER
 * Uses a PostgreSQL table to track requests.
 * Suitable for small/medium apps without Redis.
 */
export async function withDbRateLimit(
  req: Request,
  handler: (req: Request) => Promise<Response>,
  limit = 100
): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client identifier
  const identifier = req.headers.get("x-real-ip") || 
                     req.headers.get("cf-connecting-ip") || 
                     "anonymous";

  // Call the PostgreSQL function
  const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
    p_identifier: identifier,
    p_limit: limit
  });

  if (error) {
    console.error('Rate limit DB error:', error);
    // Fallback to allow if DB fails (prevent blocking legit users)
    return handler(req);
  }

  const { success, remaining, reset_at } = data[0];
  const resetTimestamp = new Date(reset_at).getTime();

  const headers = new Headers(corsHeaders);
  headers.set("X-RateLimit-Limit", limit.toString());
  headers.set("X-RateLimit-Remaining", remaining.toString());
  headers.set("X-RateLimit-Reset", Math.floor(resetTimestamp / 1000).toString());

  if (!success) {
    const now = Date.now();
    const retryAfter = Math.max(0, Math.floor((resetTimestamp - now) / 1000));
    headers.set("Retry-After", retryAfter.toString());

    return new Response(
      JSON.stringify({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Try again in ${retryAfter}s.`,
      }),
      {
        status: 429,
        headers: {
          ...Object.fromEntries(headers.entries()),
          "Content-Type": "application/json",
        },
      }
    );
  }

  const response = await handler(req);
  for (const [key, value] of headers.entries()) {
    response.headers.set(key, value);
  }

  return response;
}
