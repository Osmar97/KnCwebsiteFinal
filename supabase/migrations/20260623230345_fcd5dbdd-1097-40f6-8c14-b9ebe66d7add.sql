
CREATE TABLE IF NOT EXISTS public.site_company_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  email text,
  phone text,
  whatsapp text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_company_info TO anon;
GRANT SELECT ON public.site_company_info TO authenticated;
GRANT ALL ON public.site_company_info TO service_role;

ALTER TABLE public.site_company_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company info public read" ON public.site_company_info FOR SELECT USING (true);
CREATE POLICY "Company info admin write" ON public.site_company_info FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

CREATE TRIGGER update_site_company_info_updated_at BEFORE UPDATE ON public.site_company_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_company_info (company_name)
SELECT 'Kings ''n Company'
WHERE NOT EXISTS (SELECT 1 FROM public.site_company_info);

DROP POLICY IF EXISTS "Purchases self insert" ON public.course_purchases;
CREATE POLICY "Purchases self insert" ON public.course_purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND payment_status = 'pending');

DROP POLICY IF EXISTS "Lessons read" ON public.lessons;
CREATE POLICY "Lessons read" ON public.lessons FOR SELECT USING (
  public.is_admin_user()
  OR (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.modules m
      WHERE m.id = lessons.module_id
        AND (
          EXISTS (SELECT 1 FROM public.course_enrollments e WHERE e.user_id = auth.uid() AND e.course_id = m.course_id)
          OR EXISTS (SELECT 1 FROM public.course_purchases p WHERE p.user_id = auth.uid() AND p.course_id = m.course_id AND p.payment_status = 'paid')
        )
    )
  )
);
