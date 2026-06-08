REVOKE EXECUTE ON FUNCTION public.admin_get_property(uuid) FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_list_properties() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_tour_availability() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_tour_availability() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;