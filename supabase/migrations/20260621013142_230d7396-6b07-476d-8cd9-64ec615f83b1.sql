
-- =========================================================
-- Site social links (single-row settings)
-- =========================================================
CREATE TABLE public.site_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_url text NOT NULL DEFAULT '',
  instagram_username text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_social_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_social_links TO authenticated;
GRANT ALL ON public.site_social_links TO service_role;

ALTER TABLE public.site_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "social_links_public_read"
  ON public.site_social_links FOR SELECT
  USING (true);

CREATE POLICY "social_links_admin_write"
  ON public.site_social_links FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE TRIGGER trg_site_social_links_updated
  BEFORE UPDATE ON public.site_social_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_social_links (instagram_url, instagram_username, facebook_url, linkedin_url)
VALUES (
  'https://www.instagram.com/ismaelgq_?igsh=MXF5d3Zwa3Y3Nmt4MA==',
  'ismaelgq_',
  'https://www.facebook.com/share/1EQw4px3oD/?mibextid=wwXIfr',
  'https://www.linkedin.com/in/ismaelgq?utm_source=share_via&utm_content=profile&utm_medium=member_ios'
);

-- =========================================================
-- Instagram showcase images (curated gallery fallback)
-- =========================================================
CREATE TABLE public.instagram_showcase_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  post_url text,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_showcase_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.instagram_showcase_images TO authenticated;
GRANT ALL ON public.instagram_showcase_images TO service_role;

ALTER TABLE public.instagram_showcase_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ig_images_public_read"
  ON public.instagram_showcase_images FOR SELECT
  USING (published = true OR public.is_admin_user());

CREATE POLICY "ig_images_admin_write"
  ON public.instagram_showcase_images FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE TRIGGER trg_ig_images_updated
  BEFORE UPDATE ON public.instagram_showcase_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- Security fix: course_enrollments self-insert privilege escalation
-- =========================================================
DROP POLICY IF EXISTS "Enrollments self all" ON public.course_enrollments;
DROP POLICY IF EXISTS "Enrollments self read" ON public.course_enrollments;
DROP POLICY IF EXISTS "Enrollments admin write" ON public.course_enrollments;

CREATE POLICY "Enrollments self read"
  ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin_user());

CREATE POLICY "Enrollments admin write"
  ON public.course_enrollments FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
