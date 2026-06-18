
ALTER TABLE public.tour_destinations
  ADD COLUMN IF NOT EXISTS card_image_url text,
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS tour_destinations_read_active ON public.tour_destinations;
CREATE POLICY tour_destinations_read_active ON public.tour_destinations
  FOR SELECT TO public
  USING (active = true AND archived = false);

GRANT SELECT ON public.tour_destinations TO anon, authenticated;
GRANT ALL ON public.tour_destinations TO service_role;
