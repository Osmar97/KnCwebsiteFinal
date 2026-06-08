
-- Phase 1: Tours system schema (multilingual EN/PT/FR, English-only labels for dates)

CREATE TABLE public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  sort_order int NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  tour_type text NOT NULL DEFAULT 'group' CHECK (tour_type IN ('group','private')),
  duration_days int NOT NULL DEFAULT 3,
  destinations text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  hero_image text,
  gallery text[] NOT NULL DEFAULT '{}',
  flag text,
  badge text,
  badge_variant text DEFAULT 'dark' CHECK (badge_variant IN ('dark','gold')),
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  early_bird_price numeric(10,2),
  premium_price numeric(10,2),
  currency text NOT NULL DEFAULT 'EUR',
  name_en text NOT NULL DEFAULT '',
  name_pt text NOT NULL DEFAULT '',
  name_fr text NOT NULL DEFAULT '',
  short_desc_en text NOT NULL DEFAULT '',
  short_desc_pt text NOT NULL DEFAULT '',
  short_desc_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_pt text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tours TO anon, authenticated;
GRANT ALL ON public.tours TO service_role;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published tours" ON public.tours
  FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "Admins manage tours" ON public.tours
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE TABLE public.tour_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  capacity int NOT NULL DEFAULT 9 CHECK (capacity >= 0),
  sold_out boolean NOT NULL DEFAULT false,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.tour_dates(tour_id, start_date);

GRANT SELECT ON public.tour_dates TO anon, authenticated;
GRANT ALL ON public.tour_dates TO service_role;
ALTER TABLE public.tour_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view tour dates" ON public.tour_dates
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.tours t WHERE t.id = tour_id AND t.status = 'published'));
CREATE POLICY "Admins manage tour dates" ON public.tour_dates
  FOR ALL TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE TABLE public.tour_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_date_id uuid NOT NULL REFERENCES public.tour_dates(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled','pending')),
  customer_email text,
  customer_name text,
  stripe_session_id text UNIQUE,
  amount_paid numeric(10,2),
  currency text,
  source text NOT NULL DEFAULT 'stripe',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.tour_bookings(tour_date_id, status);

GRANT ALL ON public.tour_bookings TO service_role;
GRANT SELECT ON public.tour_bookings TO authenticated;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view bookings" ON public.tour_bookings
  FOR SELECT TO authenticated USING (public.is_admin_user());

-- Public-readable aggregate: confirmed bookings per tour_date.
-- Used by the public Tour page to render the progress bar without
-- exposing booking PII to anon.
CREATE OR REPLACE VIEW public.tour_date_availability
WITH (security_invoker = true) AS
SELECT
  d.id AS tour_date_id,
  d.tour_id,
  d.capacity,
  COALESCE(b.confirmed_count, 0)::int AS confirmed_count,
  GREATEST(d.capacity - COALESCE(b.confirmed_count, 0), 0)::int AS remaining
FROM public.tour_dates d
LEFT JOIN (
  SELECT tour_date_id, COUNT(*)::int AS confirmed_count
  FROM public.tour_bookings
  WHERE status = 'confirmed'
  GROUP BY tour_date_id
) b ON b.tour_date_id = d.id;

-- security_invoker view inherits RLS of underlying tables.
-- tour_dates allows public SELECT for published tours, tour_bookings
-- does NOT — so to let anon read the counts we expose a SECURITY
-- DEFINER function that returns only aggregate counts (no PII).
CREATE OR REPLACE FUNCTION public.get_tour_availability()
RETURNS TABLE (tour_date_id uuid, tour_id uuid, capacity int, confirmed_count int, remaining int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    d.tour_id,
    d.capacity,
    COALESCE((SELECT COUNT(*)::int FROM public.tour_bookings b WHERE b.tour_date_id = d.id AND b.status = 'confirmed'), 0),
    GREATEST(d.capacity - COALESCE((SELECT COUNT(*)::int FROM public.tour_bookings b WHERE b.tour_date_id = d.id AND b.status = 'confirmed'), 0), 0)
  FROM public.tour_dates d
  JOIN public.tours t ON t.id = d.tour_id
  WHERE t.status = 'published';
$$;
GRANT EXECUTE ON FUNCTION public.get_tour_availability() TO anon, authenticated;

CREATE TABLE public.tour_waitlist_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES public.tours(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  preferred_destinations text[] NOT NULL DEFAULT '{}',
  vibes text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.tour_waitlist_requests TO anon, authenticated;
GRANT SELECT, UPDATE ON public.tour_waitlist_requests TO authenticated;
GRANT ALL ON public.tour_waitlist_requests TO service_role;
ALTER TABLE public.tour_waitlist_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit waitlist" ON public.tour_waitlist_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view waitlist" ON public.tour_waitlist_requests
  FOR SELECT TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins update waitlist" ON public.tour_waitlist_requests
  FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

CREATE TABLE public.tour_custom_quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  nationality text,
  num_guests int,
  num_days int,
  preferred_dates text,
  destinations text[] NOT NULL DEFAULT '{}',
  vibes text[] NOT NULL DEFAULT '{}',
  hotel_preference text,
  services text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.tour_custom_quote_requests TO anon, authenticated;
GRANT SELECT, UPDATE ON public.tour_custom_quote_requests TO authenticated;
GRANT ALL ON public.tour_custom_quote_requests TO service_role;
ALTER TABLE public.tour_custom_quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit custom quote" ON public.tour_custom_quote_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view custom quotes" ON public.tour_custom_quote_requests
  FOR SELECT TO authenticated USING (public.is_admin_user());
CREATE POLICY "Admins update custom quotes" ON public.tour_custom_quote_requests
  FOR UPDATE TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- updated_at triggers
CREATE TRIGGER trg_tours_updated BEFORE UPDATE ON public.tours
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tour_dates_updated BEFORE UPDATE ON public.tour_dates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_waitlist_updated BEFORE UPDATE ON public.tour_waitlist_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_quote_updated BEFORE UPDATE ON public.tour_custom_quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
