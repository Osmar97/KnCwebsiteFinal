
-- Restrict admin-all policies on public tour config tables to authenticated role only
-- so anon SELECTs don't evaluate is_admin_user() and trigger permission denied.

DROP POLICY IF EXISTS tour_destinations_admin_all ON public.tour_destinations;
CREATE POLICY tour_destinations_admin_all ON public.tour_destinations
  FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS tour_addons_admin_all ON public.tour_addons;
CREATE POLICY tour_addons_admin_all ON public.tour_addons
  FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS tour_included_items_admin_all ON public.tour_included_items;
CREATE POLICY tour_included_items_admin_all ON public.tour_included_items
  FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

DROP POLICY IF EXISTS tour_clarity_call_slots_admin_all ON public.tour_clarity_call_slots;
CREATE POLICY tour_clarity_call_slots_admin_all ON public.tour_clarity_call_slots
  FOR ALL TO authenticated
  USING (is_admin_user()) WITH CHECK (is_admin_user());

-- Also ensure anon can execute is_admin_user (defense in depth) since it's SECURITY DEFINER
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon, authenticated;
