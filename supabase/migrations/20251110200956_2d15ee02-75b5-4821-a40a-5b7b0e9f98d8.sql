-- Update the RLS policy for PDF uploads to require user ID in path
DROP POLICY IF EXISTS "Authenticated users can upload PDFs" ON storage.objects;

CREATE POLICY "Authenticated users can upload PDFs to their folder"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'pdfs' 
  AND auth.role() = 'authenticated'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);