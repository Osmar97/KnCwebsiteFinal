
-- ============ tour_destinations ============
CREATE TABLE public.tour_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  flag text NOT NULL DEFAULT '',
  min_days integer NOT NULL DEFAULT 3,
  max_days integer NOT NULL DEFAULT 10,
  base_price_per_day_per_person numeric NOT NULL DEFAULT 1900,
  currency text NOT NULL DEFAULT 'EUR',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  label_en text NOT NULL,
  label_pt text NOT NULL DEFAULT '',
  label_fr text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  desc_pt text NOT NULL DEFAULT '',
  desc_fr text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tour_destinations TO anon, authenticated;
GRANT ALL ON public.tour_destinations TO service_role;
ALTER TABLE public.tour_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tour_destinations_read_active" ON public.tour_destinations
  FOR SELECT USING (active = true);
CREATE POLICY "tour_destinations_admin_all" ON public.tour_destinations
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE TRIGGER trg_tour_destinations_updated_at
  BEFORE UPDATE ON public.tour_destinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ tour_addons ============
CREATE TABLE public.tour_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT '✨',
  price numeric NOT NULL DEFAULT 0,
  is_complimentary boolean NOT NULL DEFAULT false,
  currency text NOT NULL DEFAULT 'EUR',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  label_en text NOT NULL,
  label_pt text NOT NULL DEFAULT '',
  label_fr text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  desc_pt text NOT NULL DEFAULT '',
  desc_fr text NOT NULL DEFAULT '',
  note_en text NOT NULL DEFAULT '',
  note_pt text NOT NULL DEFAULT '',
  note_fr text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tour_addons TO anon, authenticated;
GRANT ALL ON public.tour_addons TO service_role;
ALTER TABLE public.tour_addons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tour_addons_read_active" ON public.tour_addons
  FOR SELECT USING (active = true);
CREATE POLICY "tour_addons_admin_all" ON public.tour_addons
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE TRIGGER trg_tour_addons_updated_at
  BEFORE UPDATE ON public.tour_addons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ tour_included_items ============
CREATE TABLE public.tour_included_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  text_en text NOT NULL,
  text_pt text NOT NULL DEFAULT '',
  text_fr text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tour_included_items TO anon, authenticated;
GRANT ALL ON public.tour_included_items TO service_role;
ALTER TABLE public.tour_included_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tour_included_items_read_active" ON public.tour_included_items
  FOR SELECT USING (active = true);
CREATE POLICY "tour_included_items_admin_all" ON public.tour_included_items
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE TRIGGER trg_tour_included_items_updated_at
  BEFORE UPDATE ON public.tour_included_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ tour_clarity_call_slots ============
CREATE TABLE public.tour_clarity_call_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 15,
  is_available boolean NOT NULL DEFAULT true,
  booked_by_request_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tour_clarity_call_slots_slot_at ON public.tour_clarity_call_slots (slot_at);
GRANT SELECT ON public.tour_clarity_call_slots TO anon, authenticated;
GRANT ALL ON public.tour_clarity_call_slots TO service_role;
ALTER TABLE public.tour_clarity_call_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tour_clarity_call_slots_read_future" ON public.tour_clarity_call_slots
  FOR SELECT USING (slot_at > now());
CREATE POLICY "tour_clarity_call_slots_admin_all" ON public.tour_clarity_call_slots
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE TRIGGER trg_tour_clarity_call_slots_updated_at
  BEFORE UPDATE ON public.tour_clarity_call_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ extend tour_custom_quote_requests ============
ALTER TABLE public.tour_custom_quote_requests
  ADD COLUMN IF NOT EXISTS destination_slug text NULL,
  ADD COLUMN IF NOT EXISTS start_tour_date_id uuid NULL REFERENCES public.tour_dates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS extras_slugs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS total_amount numeric NULL,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric NULL,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS stripe_session_id text NULL,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS clarity_call_slot_id uuid NULL REFERENCES public.tour_clarity_call_slots(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS budget text NULL;

-- Allow anonymous visitors to insert their booking request (no auth required for public booking)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tour_custom_quote_requests' AND policyname='tour_custom_quote_requests_anon_insert'
  ) THEN
    CREATE POLICY "tour_custom_quote_requests_anon_insert" ON public.tour_custom_quote_requests
      FOR INSERT TO anon, authenticated WITH CHECK (true);
  END IF;
END $$;
GRANT INSERT ON public.tour_custom_quote_requests TO anon, authenticated;
