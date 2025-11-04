-- Create property-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Allow authenticated admins to upload property images
CREATE POLICY "Admins can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' 
  AND is_admin_user()
);

-- Allow authenticated admins to update property images
CREATE POLICY "Admins can update property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND is_admin_user());

-- Allow authenticated admins to delete property images
CREATE POLICY "Admins can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND is_admin_user());

-- Allow everyone to view property images
CREATE POLICY "Property images are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');