
-- Remove public read access to full properties table; restrict to admins only.
DROP POLICY IF EXISTS "Active properties are viewable by everyone" ON public.properties;

-- Create a security-barrier view exposing only marketing-safe columns of active listings.
DROP VIEW IF EXISTS public.properties_public;
CREATE VIEW public.properties_public
WITH (security_barrier = true, security_invoker = true) AS
SELECT
  id, created_at, updated_at, title, description, location, city, price,
  transaction_type, property_type, private_area, construction_area, bedrooms,
  bathrooms, condition, air_conditioning, built_in_wardrobes, elevator,
  balcony_terrace, parking, garden, pool, storage, adapted_house, luxury_house,
  sea_view, images, video_url, floor_plan_url, virtual_tour_url, floor,
  total_floors, divisions, status, featured, is_top_floor, penthouse, t0, duplex,
  operation_sale, operation_rent, building_year, heating_type, energy_class,
  lot_area, orientation_north, orientation_south, orientation_east,
  orientation_west, descriptions, floor_plans
FROM public.properties
WHERE status = 'active';

-- Allow public read of the safe view; admins keep full table access via existing policies.
GRANT SELECT ON public.properties_public TO anon, authenticated;

-- Re-add a public read policy on the underlying table scoped to the view's invoker (security_invoker view requires base policy).
CREATE POLICY "Public can read active properties (safe columns)"
ON public.properties
FOR SELECT
USING (status = 'active');

-- Revoke direct column access on sensitive fields from anon/authenticated so direct table SELECT * by non-admins cannot expose them.
REVOKE SELECT ON public.properties FROM anon;
GRANT SELECT (
  id, created_at, updated_at, title, description, location, city, price,
  transaction_type, property_type, private_area, construction_area, bedrooms,
  bathrooms, condition, air_conditioning, built_in_wardrobes, elevator,
  balcony_terrace, parking, garden, pool, storage, adapted_house, luxury_house,
  sea_view, images, video_url, floor_plan_url, virtual_tour_url, floor,
  total_floors, divisions, status, featured, is_top_floor, penthouse, t0, duplex,
  operation_sale, operation_rent, building_year, heating_type, energy_class,
  lot_area, orientation_north, orientation_south, orientation_east,
  orientation_west, descriptions, floor_plans
) ON public.properties TO anon;

-- Authenticated keeps full access at the SQL level; admin RLS policy still gates non-admins from rows beyond active, and we further protect sensitive columns from non-admin authenticated users by restricting SELECT to safe columns.
REVOKE SELECT ON public.properties FROM authenticated;
GRANT SELECT (
  id, created_at, updated_at, title, description, location, city, price,
  transaction_type, property_type, private_area, construction_area, bedrooms,
  bathrooms, condition, air_conditioning, built_in_wardrobes, elevator,
  balcony_terrace, parking, garden, pool, storage, adapted_house, luxury_house,
  sea_view, images, video_url, floor_plan_url, virtual_tour_url, floor,
  total_floors, divisions, status, featured, is_top_floor, penthouse, t0, duplex,
  operation_sale, operation_rent, building_year, heating_type, energy_class,
  lot_area, orientation_north, orientation_south, orientation_east,
  orientation_west, descriptions, floor_plans
) ON public.properties TO authenticated;

-- Admins need full column access for the admin dashboard (read/write). Grant full table privileges to authenticated for the sensitive columns ONLY through a separate path: use a SECURITY DEFINER wrapper is overkill — instead, grant full SELECT/INSERT/UPDATE/DELETE on all columns to service_role and let admin operations use is_admin_user() RLS with column-level grants for authenticated admins via a dedicated grant.
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;

-- Give authenticated full SELECT on the sensitive columns too, but rely on RLS (is_admin_user) to ensure only admins can SELECT rows beyond the public 'active' policy. Since the public policy returns only safe columns via the view, we restrict the sensitive columns at the GRANT level to admins. There's no per-role column grant for "admins only", so we expose them only to service_role and require admin reads go through a definer function or admin-only path.
CREATE OR REPLACE FUNCTION public.admin_get_property(_id uuid)
RETURNS SETOF public.properties
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.properties WHERE id = _id AND public.is_admin_user();
$$;

CREATE OR REPLACE FUNCTION public.admin_list_properties()
RETURNS SETOF public.properties
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.properties WHERE public.is_admin_user();
$$;

REVOKE ALL ON FUNCTION public.admin_get_property(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_list_properties() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_property(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_properties() TO authenticated;
