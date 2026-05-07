import { Ratelimit } from "https://esm.sh/@upstash/ratelimit@0.4.0";
import { Redis } from "https://esm.sh/@upstash/redis@1.25.1";

/**
 * PRODUCTION-READY RATE LIMITER
 * Configured for 100 requests per 1 minute per IP.
 */

// Initialize Redis client using environment variables
// These must be set in your Supabase dashboard or via CLI
const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL") || "",
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN") || "",
});

// Create the rate limiter instance
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Middleware to apply rate limiting to a request handler.
 */
export async function withRateLimit(
  req: Request,
  handler: (req: Request) => Promise<Response>
): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get client identifier (preferring IP address)
  // In Supabase, the 'x-real-ip' or 'cf-connecting-ip' headers are usually present
  const identifier = req.headers.get("x-real-ip") || 
                     req.headers.get("cf-connecting-ip") || 
                     "anonymous";

  // Check rate limit
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  // Prepare standard rate limit headers
  const headers = new Headers(corsHeaders);
  headers.set("X-RateLimit-Limit", limit.toString());
  headers.set("X-RateLimit-Remaining", remaining.toString());
  headers.set("X-RateLimit-Reset", reset.toString());

  if (!success) {
    // Calculate wait time for Retry-After header
    const now = Date.now();
    const retryAfter = Math.floor((reset - now) / 1000);
    headers.set("Retry-After", Math.max(0, retryAfter).toString());

    return new Response(
      JSON.stringify({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
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

  // Proceed to the actual handler
  const response = await handler(req);

  // Add rate limit headers to the successful response
  for (const [key, value] of headers.entries()) {
    response.headers.set(key, value);
  }

  return response;
}
