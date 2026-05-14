import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_BUCKETS = new Set(["pdfs", "videos"]);
const ALLOWED_ACTIONS = new Set(["INSERT", "UPDATE", "DELETE"]);

interface Payload {
  bucket: string;
  action: string;
  object_path?: string | null;
  success: boolean;
  error_message?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

  // Identify caller from JWT (anon-key client respects RLS; we only use it to read auth user).
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
  } = await userClient.auth.getUser();

  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (
    !body ||
    typeof body.bucket !== "string" ||
    typeof body.action !== "string" ||
    typeof body.success !== "boolean" ||
    !ALLOWED_BUCKETS.has(body.bucket) ||
    !ALLOWED_ACTIONS.has(body.action)
  ) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Determine admin status server-side (never trust the client).
  let wasAdmin = false;
  if (user) {
    const { data, error } = await userClient.rpc("is_admin_user");
    if (!error) wasAdmin = Boolean(data);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("cf-connecting-ip") ??
    null;
  const userAgent = req.headers.get("user-agent");

  // Insert via service role so the log table stays locked down to admin reads only.
  const admin = createClient(supabaseUrl, serviceKey);
  const { error: insertError } = await admin
    .from("storage_audit_log")
    .insert({
      bucket: body.bucket,
      action: body.action,
      object_path: body.object_path ?? null,
      success: body.success,
      was_admin: wasAdmin,
      user_id: user?.id ?? null,
      user_email: user?.email ?? null,
      error_message: body.error_message ?? null,
      ip_address: ip,
      user_agent: userAgent,
    });

  if (insertError) {
    console.error("storage_audit_log insert failed", insertError);
    return new Response(JSON.stringify({ error: "Log write failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Warn loudly when a non-admin attempts a write — surfaces in edge function logs.
  if (!wasAdmin) {
    console.warn(
      `[storage-audit] non-admin write attempt`,
      JSON.stringify({
        bucket: body.bucket,
        action: body.action,
        path: body.object_path,
        success: body.success,
        user_id: user?.id ?? null,
        user_email: user?.email ?? null,
        ip,
      }),
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});