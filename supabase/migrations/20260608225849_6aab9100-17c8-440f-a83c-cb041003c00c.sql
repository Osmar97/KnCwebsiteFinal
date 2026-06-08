REVOKE EXECUTE ON FUNCTION public.admin_get_property(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_list_properties() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.admin_get_property(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_properties() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;