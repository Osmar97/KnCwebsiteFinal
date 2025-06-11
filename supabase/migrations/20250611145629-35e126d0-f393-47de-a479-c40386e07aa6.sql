
-- Create storage buckets for PDFs and videos
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('pdfs', 'pdfs', true),
  ('videos', 'videos', true);

-- Create policies for PDF bucket
CREATE POLICY "Anyone can view PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can upload PDFs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pdfs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own PDFs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs" ON storage.objects
  FOR DELETE USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for video bucket
CREATE POLICY "Anyone can view videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update posts table to include PDF and video URLs
ALTER TABLE public.posts 
ADD COLUMN pdf_urls TEXT[] DEFAULT '{}',
ADD COLUMN video_urls TEXT[] DEFAULT '{}';
