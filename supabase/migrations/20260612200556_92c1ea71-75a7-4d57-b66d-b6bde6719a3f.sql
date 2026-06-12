
-- Add per-destination guest range
ALTER TABLE public.tour_destinations
  ADD COLUMN IF NOT EXISTS min_guests INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS max_guests INTEGER NOT NULL DEFAULT 10;

-- Singleton settings table for Private Tour global config
CREATE TABLE IF NOT EXISTS public.private_tour_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  min_days INTEGER NOT NULL DEFAULT 3,
  max_days INTEGER NOT NULL DEFAULT 14,
  default_currency TEXT NOT NULL DEFAULT 'EUR',
  deposit_ratio NUMERIC(4,3) NOT NULL DEFAULT 0.300,
  promo_label TEXT,
  promo_discount_pct NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT private_tour_settings_singleton CHECK (id = true)
);

GRANT SELECT ON public.private_tour_settings TO anon, authenticated;
GRANT ALL ON public.private_tour_settings TO service_role;

ALTER TABLE public.private_tour_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "private_tour_settings_read" ON public.private_tour_settings;
CREATE POLICY "private_tour_settings_read"
  ON public.private_tour_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "private_tour_settings_admin_all" ON public.private_tour_settings;
CREATE POLICY "private_tour_settings_admin_all"
  ON public.private_tour_settings FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

DROP TRIGGER IF EXISTS update_private_tour_settings_updated_at ON public.private_tour_settings;
CREATE TRIGGER update_private_tour_settings_updated_at
  BEFORE UPDATE ON public.private_tour_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton row
INSERT INTO public.private_tour_settings (id) VALUES (true)
ON CONFLICT (id) DO NOTHING;
