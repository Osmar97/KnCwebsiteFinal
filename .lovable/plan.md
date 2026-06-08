
This is a large, multi-area change. I'm proposing to deliver it in clear phases so each piece can be reviewed and validated before moving on. Please confirm or adjust before I start.

## Scope summary

Three pillars:
1. **Tour page UX changes** (modal redesign, rename, Request Custom button, vibe limit, hotel prices, dynamic progress bar)
2. **Backend: DB schema + email + storage** (tours, dates, waitlist, custom quotes, Resend wiring, audit trail)
3. **Admin CMS for Tours** (create/edit/delete/publish/duplicate/reorder tours, dates, capacity, pricing, waitlist & quote inboxes, analytics)

## Phase 1 — Database & migrations

New tables (relational, not JSON-blob):
- `tours` — name, slug, category, short/long description, hero/gallery (storage URLs), destinations[], tags[], duration_days, tour_type, base_price, early_bird_price, premium_price, currency, status (draft/published/archived), sort_order, stripe_price_id (nullable, auto-managed)
- `tour_dates` — tour_id, start_date, end_date, capacity, sold_out (bool), label (e.g. "NEXT", "HOLIDAY MARKET")
- `tour_bookings` — minimal: tour_date_id, status (confirmed/cancelled), source (stripe/admin), customer_email, stripe_session_id. Used to compute "X of Y spots filled".
- `tour_waitlist_requests` — full form payload + status
- `tour_custom_quote_requests` — full form payload + status

RLS: public SELECT on `tours` (status='published') and `tour_dates`; INSERT on waitlist/custom_quote allowed for anon with rate-limit guard; full access for admin via existing `is_admin_user()` SECURITY DEFINER function. `tour_bookings` insert only via service role (edge function).

Storage: reuse existing `property-images` bucket (or new `tour-images` bucket if you prefer separation — please confirm).

## Phase 2 — Tour page changes

- Replace hardcoded `TOURS` array in `Tour.tsx` with a `useTours()` hook fetching from Supabase.
- Rename "Upcoming Tours" → "Private Tours" (all 3 locales).
- New `TourDetailModal` matching the screenshot exactly: eyebrow category, title, description, pills (duration/type/category), Destinations row, Next date, dynamic progress bar (`confirmed / capacity`), price section, JOIN WAITLIST CTA. Reuse shadcn `Dialog`.
- Dynamic progress bar: SELECT count from `tour_bookings` WHERE tour_date_id = next_date AND status='confirmed'; computed in `useTours` query.
- "Request Custom" button on each card → smooth scroll to `#private` section (Design Your Experience).
- `InlineTourForm` updates: vibe limit 2 → 3 with validation toast; remove hotel price text (keep options).

## Phase 3 — Email + storage submission

- Reuse existing `send-tour-enquiry` edge function (which already uses Resend). Extend it to:
  1. Insert row into `tour_custom_quote_requests` or `tour_waitlist_requests` based on `kind` field
  2. Send Resend email with all submitted fields + timestamp
  3. Return `{ id }` for idempotency
- Frontend: loading/success/error states already exist; add disabled state to prevent double submit; add server-side timestamp.

## Phase 4 — Stripe continuity

- `create-stripe-checkout` reads `tour_dates.id` (or tour + date), looks up price from `tours.base_price` (or early-bird if applicable), creates checkout session with dynamic `price_data` (no need for pre-created Stripe products).
- `stripe-tour-webhook` already exists — extend it to insert a `tour_bookings` row on successful payment so progress bars update automatically.

## Phase 5 — Admin CMS

New admin route `/admin/tours` (guarded by existing `is_admin_user()` check, same pattern as `AdminProperties`):
- List with filters (status), reorder via drag-or-arrow buttons (sort_order)
- Create/Edit form (basic info, images upload to bucket, destinations multi-input, tags, duration, type)
- Dates manager (add/edit/delete dates, capacity, sold-out toggle)
- Pricing manager (base / early-bird / premium / currency)
- Duplicate / Archive / Publish-Unpublish / Delete buttons
- Waitlist inbox & Custom Quote inbox (table view, status update, export CSV)
- Analytics card row: total/active/draft tours, total bookings, waitlist count, quote count

Add link to admin nav.

## Phase 6 — Cleanup & verification

- Remove hardcoded `TOURS`, `GROUP_TOURS` arrays from `Tour.tsx`
- All copy stays in `TourTranslations.ts` (only the dynamic tour content comes from DB; static page chrome stays translated)
- TypeScript strict, no `any`, RLS verified, mobile checked

## Open questions before I start

1. **Storage bucket**: reuse `property-images` or create new `tour-images`? I recommend new `tour-images` for clarity.
2. **Tour content & translations**: should `tours.name/description/etc.` be single-language (English) for now, or multilingual columns (`name_en`, `name_pt`, `name_fr`)? Multilingual roughly doubles admin-form complexity.
3. **Seeding**: should I migrate the current 6 hardcoded tours into the DB as a seed migration, or do you want to recreate them yourself via the admin UI once it's live?
4. **Admin auth**: keep the existing email-allowlist (`is_admin_user()` checks `ismael@/joey@kingsncompany.com`) or move to a proper `user_roles` table now? The latter is more secure long-term but is a bigger change.
5. **Delivery order**: do you want it all in one big batch, or shipped in phases (Phase 1+2+3 first so the public site works, then Phase 5 admin CMS)?

Please answer these (especially 2, 3, 4, 5) and I'll proceed.
