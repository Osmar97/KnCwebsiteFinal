# Storage Policies: `pdfs` and `videos` Buckets

> **Internal documentation** — last updated 2025-06-04

## 1. Overview

The `pdfs` and `videos` storage buckets are **admin-write-only**. All non-authenticated and non-admin write attempts are rejected by Row-Level Security (RLS) policies. Read access is unrestricted (files are referenced publicly in property listings, resources, etc.).

| Bucket   | Purpose                              | Read | Write (INSERT / UPDATE / DELETE) |
|----------|--------------------------------------|------|----------------------------------|
| `pdfs`   | Property brochures, legal docs, etc. | Public | **Admins only** |
| `videos` | Property tours, academy videos, etc. | Public | **Admins only** |

## 2. How Admin Status Is Determined

Admin checks are performed server-side via the `is_admin_user()` Postgres function.

### 2.1 Database Schema

```sql
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table (1-to-many: one user can hold multiple roles)
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);
```

### 2.2 Security-Definer Function

```sql
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;
```

**Key points:**
- `SECURITY DEFINER` lets the function run with the privileges of its owner, bypassing RLS on `user_roles` and preventing recursive policy checks.
- Returns `true` if the current authenticated user has a row in `user_roles` with `role = 'admin'`.
- Returns `false` for anonymous users.

### 2.3 Frontend Context

The `AdminContext` (`src/contexts/AdminContext.tsx`) mirrors this by calling `is_admin_user()` on app load and caching the result in `isAdmin`. This drives UI affordances (e.g., showing/hiding the admin dashboard link), but the **actual gatekeeping happens in RLS and edge functions** — never client-side.

## 3. Storage RLS Policies

The Supabase Storage bucket policies enforce the admin-only rule. In the Supabase dashboard, the effective policy pattern is:

- **SELECT** — Public (anon + authenticated). Buckets are marked `public = true` so files load via `getPublicUrl()` on public listings.
- **INSERT** — `TO authenticated` + `public.is_admin_user() = true`
- **UPDATE** — `TO authenticated` + `public.is_admin_user() = true`
- **DELETE** — `TO authenticated` + `public.is_admin_user() = true`

### 3.1 Read access decision

Reads are intentionally kept public because property brochures (PDFs) and tour videos are embedded on public, unauthenticated pages. If a future requirement introduces *truly* sensitive documents (contracts, signed offers, internal-only material), they MUST go in a separate **private** bucket (`public = false`) with:

- `SELECT` policy: `TO authenticated USING (public.is_admin_user())` (or a per-owner rule)
- Client access via `supabase.storage.from(bucket).createSignedUrl(path, ttl)` — never `getPublicUrl()`

Do not flip `pdfs` or `videos` to `public = false` without first migrating every consumer (`PropertyEditor`, `AssetManager`, `PdfUpload`, `VideoUpload`, property/post render paths) off `getPublicUrl()`.

> **Important:** There is no `is_admin_user` parameter in the policy expression — call the zero-argument function exactly as `public.is_admin_user() = true`.

## 4. Audit Logging

Every write attempt (success or failure) against `pdfs` or `videos` is recorded in the `storage_audit_log` table.

### 4.1 Table Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `created_at` | timestamptz | Auto-generated |
| `bucket` | text | `pdfs` or `videos` |
| `object_path` | text | File path in bucket |
| `action` | text | `INSERT`, `UPDATE`, or `DELETE` |
| `success` | boolean | Whether the operation succeeded |
| `was_admin` | boolean | Result of `is_admin_user()` at call time |
| `user_id` | uuid | Authenticated user ID (nullable) |
| `user_email` | text | User email (nullable) |
| `error_message` | text | Error returned by storage (nullable) |
| `ip_address` | text | `x-forwarded-for` or `cf-connecting-ip` |
| `user_agent` | text | Request `User-Agent` header |

### 4.2 How It Works

1. **Frontend** (`AssetManager.tsx`) calls `supabase.functions.invoke("log-storage-attempt", { body: payload })` after every upload and delete.
2. **Edge function** (`log-storage-attempt`):
   - Validates the JWT server-side.
   - Calls `is_admin_user()` to determine admin status.
   - Writes the attempt into `storage_audit_log` using the **service role** (so RLS on the log table does not block the insert).
   - Emits a `console.warn` for every non-admin write attempt — visible in Supabase Edge Function logs.
3. **RLS on `storage_audit_log`** allows SELECT only for admins. Non-admins cannot read the audit trail.

## 5. Automated Compliance Tests

The `storage-policy-tests` edge function contains Deno tests that verify the live RLS policies against a real Supabase project.

### 5.1 Test Matrix

| Test | Bucket(s) | What It Proves |
|------|-----------|----------------|
| Non-admin INSERT rejected | `pdfs`, `videos` | Upload fails; file is not written |
| Non-admin UPDATE rejected | `pdfs`, `videos` | Update on an existing file fails |
| Non-admin DELETE rejected | `pdfs`, `videos` | Remove fails; file still exists |

### 5.2 Running Tests

```bash
# Inside the Supabase functions runtime (recommended)
supabase functions deploy storage-policy-tests
supabase functions test storage-policy-tests

# Or locally with env vars exported:
export SUPABASE_URL="https://jmaqqgaxaogkhwhffqbr.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="..."
export SUPABASE_ANON_KEY="..."
deno test --allow-net --allow-env supabase/functions/storage-policy-tests/
```

> **Note:** Tests are automatically skipped when the required environment variables are missing (e.g., local sandbox without secrets).

## 6. Checklist for Future Maintainers

When adding a new protected storage bucket:

- [ ] Create the bucket in Supabase Storage.
- [ ] Add RLS policies: public read, admin-only write (`public.is_admin_user() = true`).
- [ ] Add the bucket name to `ALLOWED_BUCKETS` in `log-storage-attempt/index.ts`.
- [ ] Add the bucket to `BUCKETS` in `storage-policy-tests/storage_policy_test.ts`.
- [ ] Add a corresponding tab / asset manager in `src/components/admin/AssetManager.tsx` (or a new component).
- [ ] Run the automated storage-policy tests to confirm enforcement.
