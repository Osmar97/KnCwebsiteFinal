
## Goal
Embed the **City Keys Intelligence (KTTC)** app at `/kttc/*` inside this site so it works as a native sub-section — same domain, same React shell, same Supabase project, one login.

Good news from the audit: KTTC is the **same stack** as this site (Vite + React 18 + TS + Tailwind 3 + shadcn + react-router-dom v6 + @supabase/supabase-js v2 + @tanstack/react-query v5). No major-version conflicts. Integration is mostly merging code, namespacing styles, and migrating the database.

---

## Architecture

```text
src/
├── App.tsx                          ← host router; adds <Route path="/kttc/*" element={<KttcApp/>} />
├── pages/, components/ …            ← unchanged host code
└── kttc/                            ← all KTTC code lives here, isolated
    ├── KttcApp.tsx                  ← KTTC's own <Routes> tree, no BrowserRouter
    ├── KttcThemeShell.tsx           ← wraps children in <div className="kttc-root"> for scoped theme
    ├── pages/                       ← Login, Signup, Dashboard, CityPapers, …
    ├── components/                  ← AuthProvider (KTTC), ProtectedRoute, landing/, dashboard/, ui/…
    ├── hooks/useUserAccess.ts
    ├── styles/kttc.css              ← scoped :root → .kttc-root { … } theme
    └── lib/supabase.ts              ← re-exports shared @/integrations/supabase/client
```

**Routing.** Host keeps its `BrowserRouter`. KTTC's `App.tsx` becomes `KttcApp.tsx` — drops its own `BrowserRouter`, exposes `<Routes>` only. All KTTC paths are declared relative (`login`, `dashboard`, `dashboard/city-papers/:id` …) so they resolve under `/kttc/*`. A single host route `<Route path="/kttc/*" element={<KttcApp />} />` mounts the subtree.

**Theme isolation.** KTTC ships a dark gold theme that hardcodes `--background`, `--foreground`, `--primary`, sidebar tokens, etc. in `:root` — this would override the host's light theme. We rewrite `src/kttc/styles/kttc.css` to declare the same tokens under `.kttc-root { … }` instead of `:root`. `KttcThemeShell` wraps the whole subtree in that class so the dark theme only applies under `/kttc/*`. Google Fonts (Playfair Display, Inter) load globally — harmless, host already uses similar fonts.

**Auth (single sign-on).** Because we collapse onto one Supabase project, one login serves both sites. KTTC's `AuthProvider` and `ProtectedRoute` are kept inside `src/kttc/` and use the shared client. A user logged in on the host is automatically logged in on `/kttc/*` and vice-versa.

**Tailwind.** Host `tailwind.config.ts` content globs already cover `src/**/*` so KTTC components are picked up automatically. We merge KTTC's extra font families (`Playfair Display`, `Inter`) and `sidebar-*` color tokens into the host config. KTTC's `tailwind.config.ts` is discarded.

**Vite.** No `base` change needed — same Vite app, same root. We do **not** copy KTTC's `vite.config.ts`.

---

## Database migration (host Supabase)

The host Supabase project gains the KTTC schema. No name collisions detected with existing host tables (`posts`, `properties`, `tours`, `tour_bookings`, …).

Migration adds, in one file:

- **Enum** `app_role` (`'admin' | 'moderator' | 'user'`).
- **Function** `public.has_role(_role app_role, _user_id uuid)` (security definer, used by RLS).
- **Tables** (with `GRANT`s + `ENABLE RLS` + policies for each):
  `profiles`, `user_roles`, `countries`, `cities`, `neighborhoods`, `neighborhood_details`, `neighborhood_stats`, `partners`, `city_papers`, `experiences`, `bookings`, `consultations`, `learning_paths`, `path_courses`, `courses`, `modules`, `lessons`, `lesson_attachments`, `lesson_bookmarks`, `lesson_progress`, `video_watch_history`, `user_lesson_activity`, `course_enrollments`, `course_favorites`, `course_purchases`, `course_resources`, `quizzes`, `quiz_questions`, `quiz_answers`, `user_quiz_attempts`, `user_quiz_answers`, `deal_calculators`, `resources`, `webinars`, `posts_kttc`, `comments_kttc`, `likes_kttc`, `user_shortlists`.
- **Views**: `partners_public`, `public_user_profiles`, `quiz_answers_public`.
- **Trigger** to auto-insert a `profiles` row on `auth.users` signup (`status='pending'`).
- **Storage bucket** `avatars` (public).

> Naming note: KTTC's `posts`/`comments`/`likes` collide with host's existing `posts`. We rename the KTTC ones to `posts_kttc`/`comments_kttc`/`likes_kttc` and update the few KTTC files that reference them. Conflict matrix shows no other collisions.

> User migration: since the old KTTC Supabase is a different project, existing KTTC users cannot be silently brought over (auth.users hashes can't be moved between projects via SQL). New users sign up fresh on the merged site; if you have an existing KTTC user list to import, share the CSV and we'll script invites in a follow-up.

---

## Edge functions

Copied into `supabase/functions/` under KTTC-prefixed names to avoid any collisions:

| Original | New name | Notes |
|---|---|---|
| `ai-chat` | `kttc-ai-chat` | Uses existing `LOVABLE_API_KEY` already in host secrets. |
| `create-checkout` | `kttc-create-checkout` | Uses existing `STRIPE_SECRET_KEY`. Switch `SUPABASE_PUBLISHABLE_KEY` → `SUPABASE_ANON_KEY` (already present). |
| `stripe-webhook` | `kttc-stripe-webhook` | **Add real signature verification** using existing `STRIPE_WEBHOOK_SECRET`. |
| `delete-account` | `kttc-delete-account` | |
| `admin-delete-user` | `kttc-admin-delete-user` | |

All required secrets already exist on the host project — no new secrets to add.

---

## Frontend tasks

1. Copy KTTC `src/` into `src/kttc/`, drop its `main.tsx`, `index.html`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig*`, `package.json` (deps merged into host).
2. Replace KTTC's `supabase/client.ts` with a thin re-export of `@/integrations/supabase/client` so there's a single client instance.
3. Convert `App.tsx` → `KttcApp.tsx`:
   - Remove `BrowserRouter`, `QueryClientProvider` (host already provides one), and the inner `Toaster`/`Sonner` (host already mounts these).
   - Keep KTTC's `AuthProvider` (so KTTC's `useAuth`/`useUserAccess` continue to work — they wrap, not replace, the shared supabase client).
   - Wrap the route tree in `<KttcThemeShell>`.
4. Update every KTTC `<Link>`/`navigate(...)` from `/login`, `/dashboard/...` to relative or `/kttc/...`. (Most can be left as relative paths — react-router resolves them under the mounted `/kttc/*`.)
5. Update KTTC files that referenced `posts`/`comments`/`likes` to use `posts_kttc`/`comments_kttc`/`likes_kttc`.
6. Host mount in `src/App.tsx`:
   ```tsx
   <Route path="/kttc/*" element={<KttcApp />} />
   ```
7. Add a nav entry in the host's `Navigation.tsx` (and footer if applicable) linking to `/kttc`. Optional dropdown items for `/kttc/explore` and `/kttc/dashboard`.
8. Merge dependencies into host `package.json`: `framer-motion`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`. Everything else (Radix, react-hook-form, zod, recharts, embla, sonner, pdfjs-dist, react-query, RR6, supabase-js) is already installed.

---

## SEO

- Add `/kttc`, `/kttc/explore`, `/kttc/login`, `/kttc/signup` to `public/sitemap.xml`. Dynamic `/kttc/explore/:country/:city` URLs added once you confirm you want them indexable.
- Add a `<title>` and meta description for the KTTC landing page using the same `<Helmet>`-less pattern this site already uses (`document.title` + meta tag updates in the page component).
- KTTC's protected dashboard routes (`/kttc/dashboard/*`) are left out of the sitemap and a `noindex` meta is added on the `ProtectedRoute` wrapper.

---

## Responsive / cross-device

KTTC is already fully responsive (Tailwind + shadcn). The wrapper does not change layout. We'll spot-check `/kttc`, `/kttc/explore`, `/kttc/login`, `/kttc/dashboard` at mobile, tablet, desktop after integration.

---

## Verification

- TypeScript clean (`tsc --noEmit` runs automatically).
- Manually navigate `/`, `/services`, `/kttc`, `/kttc/login`, `/kttc/signup` → submit signup → land on `/kttc/pending`.
- Set `profiles.status='active'` for the test user → `/kttc/dashboard` loads with sidebar.
- Switch from `/kttc/dashboard` to `/services` and back — session persists, host theme returns to light, KTTC stays dark.
- Stripe checkout from `/kttc/dashboard/experiences` redirects back correctly.

---

## What I will NOT change

- Host site's design tokens, routes, or auth.
- Host's existing tables (`posts`, `tours`, `properties`, …).
- KTTC's visual design — kept identical to its current dark gold theme, just scoped.

---

## Open items I'd like you to confirm before I start (optional — defaults shown)

1. **KTTC nav entry label** → default: "City Keys" linking to `/kttc`.
2. **Sub-path** is `/kttc` exactly (case-sensitive). OK?
3. **Existing KTTC users**: re-register on the merged site, or share an export for batch invites later?

If you're good with the defaults, just say "go" and I'll switch to build mode and execute.
