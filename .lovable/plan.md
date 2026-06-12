
## Scope (per your answers)

- Keep everything; remove nothing (no deletion of quote requests, clarity slots, destinations, etc.).
- Add admin management UIs so all values shown on the public Private Tour flow become database-driven and editable.

## Schema changes (one migration)

1. Add columns to `tour_destinations`:
   - `min_guests INT NOT NULL DEFAULT 1`
   - `max_guests INT NOT NULL DEFAULT 10`
2. New singleton table `private_tour_settings`:
   - `id` (fixed `true` boolean PK so only one row), `min_days`, `max_days`, `default_currency`, `deposit_ratio` (numeric, default 0.30), `promo_label`, `promo_discount_pct`, timestamps
   - Public `SELECT`; admin-only writes via `is_admin_user()`.
3. RLS already exists for `tour_destinations`, `tour_addons`, `tour_dates`, `tour_clarity_call_slots` — verify admin write policies exist; add the few that are missing.

## New admin pages (added to Admin Dashboard + sidebar)

Located under `/admin/private-tour/*`, each a list + inline editor following the pattern of `AdminTours.tsx`:

- **Duration & Pricing** (`/admin/private-tour/settings`) — edits the singleton: global min/max days, default currency, deposit ratio, promo fields.
- **Destinations** (`/admin/private-tour/destinations`) — CRUD on `tour_destinations` including per-destination `min_guests`, `max_guests`, `base_price_per_day_per_person`, `currency`, flag, translations, sort, active toggle.
- **Add-Ons** (`/admin/private-tour/addons`) — CRUD on `tour_addons`: price, complimentary flag, currency, translations, sort, active toggle.
- **Available Dates** (`/admin/private-tour/dates`) — CRUD on `tour_dates`: start/end, capacity, sold-out toggle, label. (Already used by both group tours and the private flow.)
- **Included Items** (`/admin/private-tour/included`) — small CRUD on `tour_included_items` so the "What's included" list is also editable.

A new `AdminDashboard` card group "Private Tour" links to all five.

## Frontend wiring

- Extend `usePrivateTourConfig` to also load the `private_tour_settings` row.
- Replace the hardcoded `PRIVATE_TOUR_DEPOSIT_RATIO` fallback in `usePrivateTourBooking` with the value from settings (kept as fallback constant if fetch fails).
- `PrivateTourBookingFlow` already reads days/persons ranges and price from the destination row — switch the global day range and currency formatting to read from settings, and the persons slider min/max to read from the selected destination's new `min_guests`/`max_guests`.

## Out of scope (per your "don't remove anything")

- `tour_custom_quote_requests`, `tour_clarity_call_slots`, AdminQuotes, send-tour-enquiry, Stripe checkout — all untouched.
- `tour_destinations` is kept and admin-managed.

## Technical notes

- Singleton settings table uses `id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id)` so upsert is trivial.
- All new tables/columns include `service_role` GRANTs and the standard `anon SELECT` / `authenticated SELECT` so the public flow continues working.
- Admin write policies use existing `public.is_admin_user()`.
- New admin pages registered in `src/App.tsx` routes alongside the other `/admin/*` entries.
