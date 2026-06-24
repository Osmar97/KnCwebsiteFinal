
-- 1) contact_submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(coalesce(name,'')) BETWEEN 1 AND 100
    AND char_length(coalesce(email,'')) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(coalesce(message,'')) BETWEEN 1 AND 5000
  );
CREATE POLICY "Admins manage contact submissions"
  ON public.contact_submissions FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) crm_lead_metadata
CREATE TABLE public.crm_lead_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  source_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_to_email TEXT,
  lead_score INT NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  country TEXT,
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source, source_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_lead_metadata TO authenticated;
GRANT ALL ON public.crm_lead_metadata TO service_role;
ALTER TABLE public.crm_lead_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm metadata"
  ON public.crm_lead_metadata FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
CREATE TRIGGER update_crm_lead_metadata_updated_at
  BEFORE UPDATE ON public.crm_lead_metadata
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_crm_metadata_status ON public.crm_lead_metadata(status);
CREATE INDEX idx_crm_metadata_source ON public.crm_lead_metadata(source);

-- 3) crm_notes
CREATE TABLE public.crm_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  source_id UUID NOT NULL,
  author_email TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_notes TO authenticated;
GRANT ALL ON public.crm_notes TO service_role;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm notes"
  ON public.crm_notes FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());
CREATE TRIGGER update_crm_notes_updated_at
  BEFORE UPDATE ON public.crm_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_crm_notes_lead ON public.crm_notes(source, source_id, created_at DESC);
