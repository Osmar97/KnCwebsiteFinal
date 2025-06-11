
-- First, let's check what policies exist and remove conflicting ones
DROP POLICY IF EXISTS "Authenticated users can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own videos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own videos" ON storage.objects;

-- Create RLS policies for PDF uploads
CREATE POLICY "Authenticated users can upload PDFs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pdfs' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');

CREATE POLICY "Users can update their own PDFs" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'pdfs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own PDFs" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'pdfs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create RLS policies for video uploads
CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'videos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Users can update their own videos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'videos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
