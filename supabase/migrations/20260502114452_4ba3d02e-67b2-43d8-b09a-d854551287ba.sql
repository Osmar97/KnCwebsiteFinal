
-- 1. Fix is_admin_user search_path
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN auth.email() IN (
    'ismael@kingsncompany.com',
    'joey@kingsncompany.com'
  );
END;
$function$;

-- 2. Replace public SELECT policy on properties with one that hides sensitive columns
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

-- Public can only read active properties; sensitive fields will be exposed via column-level revokes
CREATE POLICY "Active properties are viewable by everyone"
ON public.properties
FOR SELECT
TO public
USING (status = 'active'::text);

CREATE POLICY "Admins can view all properties"
ON public.properties
FOR SELECT
TO authenticated
USING (is_admin_user());

-- 3. Use column-level grants to hide sensitive columns from anon/public
REVOKE SELECT ON public.properties FROM anon, authenticated;

-- Grant SELECT only on non-sensitive columns to anon and authenticated
GRANT SELECT (
  id, created_at, updated_at, title, description, location, city, price,
  transaction_type, property_type, private_area, construction_area, bedrooms,
  bathrooms, condition, air_conditioning, built_in_wardrobes, elevator,
  balcony_terrace, parking, garden, pool, storage, adapted_house, luxury_house,
  sea_view, images, video_url, floor_plan_url, virtual_tour_url, floor,
  total_floors, divisions, status, featured, is_top_floor, penthouse, t0, duplex,
  street_number, no_street_number, block, door, urbanization_name,
  operation_sale, operation_rent, building_year, heating_type, energy_class,
  lot_area, orientation_north, orientation_south, orientation_east,
  orientation_west, internal_reference, notes_visibility, descriptions, floor_plans
) ON public.properties TO anon, authenticated;

-- Admins (checked via RLS policies and is_admin_user) need full column access.
-- Grant full SELECT/INSERT/UPDATE/DELETE on all columns to authenticated;
-- RLS still restricts which rows/operations they can perform.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
