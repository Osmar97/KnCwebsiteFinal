GRANT SELECT ON public.properties_public TO anon, authenticated;
GRANT SELECT ON public.properties_public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT ON public.properties TO anon;
GRANT ALL ON public.properties TO service_role;