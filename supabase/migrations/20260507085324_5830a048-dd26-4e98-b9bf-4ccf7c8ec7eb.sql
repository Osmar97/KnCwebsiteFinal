
-- 1. Properties: revoke SELECT on sensitive columns from anon/authenticated
REVOKE SELECT (private_notes, internal_reference, agent_captador, agent_comercializador, notes_visibility)
  ON public.properties FROM anon, authenticated;

-- Re-grant SELECT on the safe columns to anon/authenticated explicitly
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
  orientation_west, descriptions, floor_plans
) ON public.properties TO anon, authenticated;

-- 2. Storage videos: restrict uploads to user folder
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Users can upload videos to their folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 3. Drop broad listing policies on public buckets (files still served via public URL)
DROP POLICY IF EXISTS "Anyone can view PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
