DROP POLICY IF EXISTS "Public can read active properties (safe columns)" ON public.properties;
REVOKE SELECT ON public.properties FROM anon;
GRANT SELECT ON public.properties_public TO anon, authenticated;