
# KTTC Full Backend Migration — Plan

Your Supabase (`jmaqqgaxaogkhwhffqbr`) currently has only host-app tables (`posts`, `properties`, tours…). No KTTC tables and no `profiles` table exist, so this is a clean install and KTTC can use `profiles` directly without namespacing.

I will send **one consolidated migration** (with the **Apply** button) covering all 38 KTTC tables + roles + storage + RLS, derived from `src/kttc/integrations/supabase/types.ts` so the frontend types match exactly on first run.

## What the migration creates

**Core / auth**
- `app_role` enum (`admin`, `moderator`, `user`, `pending`)
- `profiles` (linked to `auth.users` via trigger `on_auth_user_created`)
- `user_roles` + `has_role(uuid, app_role)` SECURITY DEFINER helper
- `update_updated_at_column()` trigger (reuses existing host function)

**Geography & content**
- `countries`, `cities`
- `neighborhoods`, `neighborhood_details`, `neighborhood_stats`
- `city_papers` (markdown + PDF sections)
- `partners`, `partners_public` view
- `resources`, `experiences`, `webinars`, `consultations`, `bookings`
- `deal_calculators`, `user_shortlists`

**LMS**
- `courses`, `modules`, `lessons`, `lesson_attachments`
- `course_enrollments`, `course_favorites`, `course_purchases`, `course_resources`
- `lesson_progress`, `lesson_bookmarks`, `user_lesson_activity`, `video_watch_history`
- `learning_paths`, `path_courses`

**Quizzes**
- `quizzes`, `quiz_questions`, `quiz_answers`
- `user_quiz_attempts`, `user_quiz_answers`
- `quiz_answers_public` view (hides correctness)

**Community (namespaced to avoid host `posts` collision)**
- `posts_kttc`, `comments_kttc`, `likes_kttc` (added to `supabase_realtime` publication)
- `public_user_profiles` view (safe author info)

**Storage buckets**
- `avatars`, `city-papers`, `lesson-videos`, `lesson-thumbnails`, `course-assets`
- RLS policies: public read for public buckets, owner-write, admin-manage

**Access control**
- RLS enabled on every public table
- `GRANT`s for `anon` (public reads), `authenticated` (per-user CRUD), `service_role` (full) on each table — included in the same migration to avoid PostgREST permission errors
- Policies use `has_role(auth.uid(), 'admin')` for admin-only mutations and `auth.uid() = user_id` for user-scoped rows
- Pending-approval flow: signup creates `profiles` row with `status='pending'`; `ProtectedRoute` already redirects them to `/kttc/pending`

## What does NOT change
- No edits to host tables (`posts`, `properties`, tours, storage_audit_log)
- Existing buckets (`pdfs`, `videos`, `property-images`) untouched
- No frontend changes — KTTC code already targets these table names; types regenerate after Apply

## Technical notes
- `service_role` is granted on every table since `kttc-*` edge functions need elevated access
- Community tables use `REPLICA IDENTITY FULL` + realtime publication so KTTC's live feed works
- Trigger `handle_new_user()` is `SECURITY DEFINER` with `set search_path = public`
- All check constraints replaced by validation triggers where time-based (none required here, but enrollments use a status enum)

## After you click Apply
1. Supabase regenerates `src/integrations/supabase/types.ts`
2. I run the Supabase linter and patch any flagged policies
3. `/kttc/*` becomes fully functional — signup → pending → admin approves via `/kttc/dashboard/admin` → user gains access

No code changes are needed from you; just hit **Apply** on the migration card I'll send next.
