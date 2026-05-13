// Automated checks: verify that ONLY admins can INSERT/UPDATE/DELETE files in
// the `pdfs` and `videos` storage buckets. We exercise the live RLS policies
// against a real Supabase project using an ephemeral non-admin user.
//
// Run with: lovable-exec test (or supabase--test_edge_functions)

import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY =
  Deno.env.get("SUPABASE_ANON_KEY") ??
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

const BUCKETS = ["pdfs", "videos"] as const;

function makeFile(name: string, content = "test") {
  return new File([new Blob([content])], name, { type: "text/plain" });
}

// deno-lint-ignore no-explicit-any
type AnyClient = any;

async function withNonAdminUser<T>(
  fn: (ctx: {
    userId: string;
    email: string;
    userClient: AnyClient;
    adminClient: AnyClient;
  }) => Promise<T>,
): Promise<T> {
  assert(SUPABASE_URL, "SUPABASE_URL env required");
  assert(SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY env required");
  assert(ANON_KEY, "SUPABASE_ANON_KEY/PUBLISHABLE_KEY env required");

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = `nonadmin-${crypto.randomUUID()}@test.kingsncompany.dev`;
  const password = `Pw!${crypto.randomUUID()}`;

  const { data: created, error: createErr } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  assert(!createErr, `failed to create test user: ${createErr?.message}`);
  const userId = created.user!.id;

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: signInErr } = await userClient.auth.signInWithPassword({
    email,
    password,
  });
  assert(!signInErr, `failed to sign in test user: ${signInErr?.message}`);

  try {
    return await fn({ userId, email, userClient, adminClient });
  } finally {
    // Cleanup: any objects this user managed to create + the user itself.
    for (const bucket of BUCKETS) {
      const { data: listed } = await adminClient.storage
        .from(bucket)
        .list(userId);
      if (listed?.length) {
        await adminClient.storage
          .from(bucket)
          .remove(listed.map((o) => `${userId}/${o.name}`));
      }
    }
    await adminClient.auth.admin.deleteUser(userId);
  }
}

for (const bucket of BUCKETS) {
  Deno.test(`[${bucket}] non-admin INSERT is rejected`, async () => {
    await withNonAdminUser(async ({ userId, userClient, adminClient }) => {
      const path = `${userId}/insert-test.txt`;
      const { error } = await userClient.storage
        .from(bucket)
        .upload(path, makeFile("a.txt"), { upsert: false });
      assert(error, `expected non-admin upload to ${bucket} to fail`);

      // Confirm nothing was actually written.
      const { data: listed } = await adminClient.storage
        .from(bucket)
        .list(userId);
      assertEquals(
        listed?.length ?? 0,
        0,
        `non-admin should not have written any file to ${bucket}`,
      );
    });
  });

  Deno.test(`[${bucket}] non-admin UPDATE is rejected`, async () => {
    await withNonAdminUser(async ({ userId, userClient, adminClient }) => {
      // Seed an admin-owned file via service role (bypasses RLS).
      const path = `${userId}/update-test.txt`;
      const seed = await adminClient.storage
        .from(bucket)
        .upload(path, makeFile("seed"), { upsert: true });
      assert(!seed.error, `seed upload failed: ${seed.error?.message}`);

      const { error } = await userClient.storage
        .from(bucket)
        .update(path, makeFile("hacked"), { upsert: false });
      assert(error, `expected non-admin update on ${bucket} to fail`);
    });
  });

  Deno.test(`[${bucket}] non-admin DELETE is rejected`, async () => {
    await withNonAdminUser(async ({ userId, userClient, adminClient }) => {
      const path = `${userId}/delete-test.txt`;
      const seed = await adminClient.storage
        .from(bucket)
        .upload(path, makeFile("seed"), { upsert: true });
      assert(!seed.error, `seed upload failed: ${seed.error?.message}`);

      const { error: removeErr } = await userClient.storage
        .from(bucket)
        .remove([path]);
      // Storage's remove() can return ok with empty data when RLS blocks it,
      // so verify the file still exists rather than relying solely on `error`.
      const { data: stillThere } = await adminClient.storage
        .from(bucket)
        .list(userId);
      const names = (stillThere ?? []).map((o) => o.name);
      assert(
        names.includes("delete-test.txt"),
        `non-admin DELETE on ${bucket} should not remove the file (error=${removeErr?.message ?? "none"})`,
      );
    });
  });
}