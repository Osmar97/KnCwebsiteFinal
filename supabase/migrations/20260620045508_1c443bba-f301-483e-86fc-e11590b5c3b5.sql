
CREATE TABLE public.tour_where_we_go (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_name_en text NOT NULL,
  country_name_pt text,
  country_name_fr text,
  subtitle_en text,
  subtitle_pt text,
  subtitle_fr text,
  description_en text,
  description_pt text,
  description_fr text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tour_where_we_go TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tour_where_we_go TO authenticated;
GRANT ALL ON public.tour_where_we_go TO service_role;

ALTER TABLE public.tour_where_we_go ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published where_we_go cards"
  ON public.tour_where_we_go FOR SELECT
  USING (published = true OR public.is_admin_user());

CREATE POLICY "Admins can insert where_we_go cards"
  ON public.tour_where_we_go FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can update where_we_go cards"
  ON public.tour_where_we_go FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Admins can delete where_we_go cards"
  ON public.tour_where_we_go FOR DELETE
  USING (public.is_admin_user());

CREATE TRIGGER update_tour_where_we_go_updated_at
  BEFORE UPDATE ON public.tour_where_we_go
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tour_where_we_go (country_name_en, country_name_pt, country_name_fr, subtitle_en, subtitle_pt, subtitle_fr, sort_order, published)
VALUES
  ('Portugal', 'Portugal', 'Portugal', 'Lisbon · Porto · Algarve', 'Lisboa · Porto · Algarve', 'Lisbonne · Porto · Algarve', 1, true),
  ('Cabo Verde', 'Cabo Verde', 'Cap-Vert', 'Praia · Sal · São Vicente', 'Praia · Sal · São Vicente', 'Praia · Sal · São Vicente', 2, true);

-- lesson-videos storage RLS
CREATE POLICY "Enrolled or paid users can read lesson videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'lesson-videos'
    AND (
      public.is_admin_user()
      OR EXISTS (
        SELECT 1
        FROM public.lessons l
        JOIN public.modules m ON m.id = l.module_id
        WHERE l.video_storage_path = storage.objects.name
          AND (
            EXISTS (SELECT 1 FROM public.course_enrollments ce WHERE ce.course_id = m.course_id AND ce.user_id = auth.uid())
            OR EXISTS (SELECT 1 FROM public.course_purchases cp WHERE cp.course_id = m.course_id AND cp.user_id = auth.uid() AND cp.payment_status = 'paid')
          )
      )
    )
  );

CREATE POLICY "Admins can insert lesson videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lesson-videos' AND public.is_admin_user());

CREATE POLICY "Admins can update lesson videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'lesson-videos' AND public.is_admin_user())
  WITH CHECK (bucket_id = 'lesson-videos' AND public.is_admin_user());

CREATE POLICY "Admins can delete lesson videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'lesson-videos' AND public.is_admin_user());
