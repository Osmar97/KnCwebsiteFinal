
DROP POLICY IF EXISTS "Authenticated users can upload PDFs to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload videos to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;

CREATE POLICY "Admins can upload PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pdfs' AND public.is_admin_user());

CREATE POLICY "Admins can update PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pdfs' AND public.is_admin_user());

CREATE POLICY "Admins can delete PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'pdfs' AND public.is_admin_user());

CREATE POLICY "Admins can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos' AND public.is_admin_user());

CREATE POLICY "Admins can update videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'videos' AND public.is_admin_user());

CREATE POLICY "Admins can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos' AND public.is_admin_user());
