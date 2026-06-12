# Private Tour — "Design your Experience" rebuild

Rebuild the `#group` section on `/POT` to match the attached `tour-booking-flow.jsx` design as an **inline 4-step flow** (Experience → Dates → Your Details → Confirm & Pay), DB-driven, with Stripe Checkout (redirect) for the 30% deposit and Resend confirmation, fully translated (EN / PT / FR via AI translate).

## What changes

### 1. Database (one migration)

New tables (all `service_role` writes only; `anon` + `authenticated` read where flagged active):

- `tour_destinations` — `slug`, `flag`, `min_days`, `max_days`, `base_price_per_day_per_person numeric`, `currency`, `sort_order`, `active`, `label_en/pt/fr`, `desc_en/pt/fr`.
- `tour_addons` — `slug`, `icon`, `price numeric`, `is_complimentary bool`, `sort_order`, `active`, `label_en/pt/fr`, `desc_en/pt/fr`, `note_en/pt/fr` (e.g. "Complimentary").
- `tour_included_items` — `sort_order`, `text_en/pt/fr`.
- `tour_clarity_call_slots` — `slot_at timestamptz`, `is_available bool` (filtered by `> now()`); seeded from a script later or via admin. Available dates for the step "Dates" reuse the existing **`tour_dates`** table (filtered by status='published' + future + `get_tour_availability`).
- Extend `tour_custom_quote_requests` (already exists) with `start_tour_date_id uuid null`, `extras_slugs text[]`, `deposit_amount numeric`, `total_amount numeric`, `stripe_session_id text`, `payment_status text default 'pending'`, `clarity_call_slot_id uuid null`.

Each new public table gets `GRANT SELECT TO anon, authenticated` (active rows only via RLS) + `GRANT ALL TO service_role`, RLS enabled, plus `updated_at` trigger.

Seed data inserted via `supabase--insert` so the section renders out of the box with the three destinations, eight add-ons, and nine included items from the attached file (translated EN/PT/FR via the existing `translate-text` edge function).

### 2. Edge functions

- `create-private-tour-checkout` (new) — accepts `{ request_id, deposit_amount, customer_email, customer_name, tour_summary }`, creates Stripe Checkout session in `mode: 'payment'`, success/cancel URLs back to `/POT?booking=success|cancelled`, returns `{ url }`. Persists `stripe_session_id` on the request.
- Extend existing `stripe-tour-webhook` to mark `tour_custom_quote_requests.payment_status='paid'` on `checkout.session.completed` matching `stripe_session_id`, and trigger Resend confirmation.
- Reuse `send-tour-enquiry` for the initial "Reserve my spot" submit (request received email + admin notification). Pass new fields (destination, days, persons, extras, dates, total, deposit).

### 3. Frontend

- New `src/hooks/usePrivateTourConfig.ts` — single React Query hook that fetches destinations, addons, included items, future `tour_dates` (with availability), and clarity-call slots in parallel.
- Replace `InlineTourForm.tsx` with a new `PrivateTourBookingFlow.tsx` rendered inside the existing `#group` section in `TourGroupSection.tsx` (keep the section's outer heading "PRIVATE TOUR / Design your Experience" — the attached page-level H1 is replaced by the existing section H1 to preserve page hierarchy).
- Composition (1:1 with the attached file, Tailwind + design tokens, not inline styles):
  - `Steps` indicator (4 steps, gold/black/border tokens).
  - **Step 0 Experience**: destination grid (3 cards), duration range slider + day chips, persons stepper (1–10), add-ons grid (2-col, single-col on mobile), "Always included" list, live `PriceSummary`.
  - **Step 1 Dates**: grid of future `tour_dates` (label = start date + computed end based on selected `days`), "None of these work?" CTA → opens Step 3 clarity-call panel. Compact `PriceSummary`.
  - **Step 2 Details**: name, email, WhatsApp, nationality, budget, message; full `PriceSummary`.
  - **Step 3 Confirm**: full summary card + `PriceSummary` + cancellation policy note.
  - **Post-submit screen**: two choices — "Pay deposit now" (calls `create-private-tour-checkout`, redirects to Stripe) or "Book a clarity call" (picks a `tour_clarity_call_slots` row, writes back to request, success toast). WhatsApp / email footer.
- Design tokens added to `index.css` & `tailwind.config.ts`: `--tour-gold`, `--tour-gold-light`, `--tour-near-black`, `--tour-surface`, `--tour-surface-2`, `--tour-border`, `--tour-border-gold`, `--tour-text`, `--tour-muted`. No hex literals in components.
- Responsive: destination/addons/dates grids collapse to 1 col below `md`; persons row wraps; price summary stays full-width below content on mobile (already implicit).
- Validation: per-step `canProceed` gating, button disabled state, inline required marks; budget free-text; message textarea max 2000 chars.
- All copy goes through `tour-translations/{en,pt,fr}.ts` under a new `private_tour_flow.*` namespace; auto-translated via `translate-text` for PT/FR strings I author in EN.

### 4. Files

- **New**: `src/components/tour/PrivateTourBookingFlow.tsx`, `src/components/tour/private-tour/Steps.tsx`, `PriceSummary.tsx`, `StepExperience.tsx`, `StepDates.tsx`, `StepDetails.tsx`, `StepConfirm.tsx`, `PostSubmitPanel.tsx`, `src/hooks/usePrivateTourConfig.ts`, `supabase/functions/create-private-tour-checkout/index.ts`.
- **Edited**: `src/components/tour/TourGroupSection.tsx` (mount new flow inside existing section), `src/components/tour/InlineTourForm.tsx` (deleted or reduced to thin shim if any other caller — verify), `src/pages/tour-translations/{en,pt,fr}.ts`, `src/pages/Tour.css`, `tailwind.config.ts`, `index.css`, `supabase/functions/stripe-tour-webhook/index.ts`, `supabase/functions/send-tour-enquiry/index.ts`.
- **Migration**: one timestamped file creating the four new tables + seeds via follow-up inserts.

### 5. Verification

- Migration applies clean; `tour_destinations`/`tour_addons`/`tour_included_items` selectable as `anon`.
- Section renders 4 steps; navigation respects `canProceed`.
- Price recomputes live (base × days × persons + extras × persons; deposit = round(0.3 × total)).
- "Reserve my spot" writes `tour_custom_quote_requests` row + sends Resend emails.
- "Pay deposit" redirects to Stripe Checkout; webhook flips `payment_status` to paid and emails confirmation.
- Lang switch updates every label/placeholder/button; no hardcoded EN strings remain.
- Tablet + mobile: cards stack, stepper readable, slider full-width, no overflow.
- `bun run build` passes with zero TS errors.

## Out of scope

- Inline Stripe Elements (explicitly chosen Checkout redirect).
- Admin UI for managing destinations/add-ons/included items/call slots (seeded via SQL for now; can come next).
- Migrating existing `InlineTourForm` callers other than the `#group` section (verified single use).
