
CREATE TABLE public.crm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL CHECK (source IN ('waitlist','quote','contact')),
  source_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  assigned_to_email text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','cancelled')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  created_by_email text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_tasks TO authenticated;
GRANT ALL ON public.crm_tasks TO service_role;

ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage crm tasks"
  ON public.crm_tasks
  FOR ALL
  TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

CREATE INDEX crm_tasks_source_idx ON public.crm_tasks (source, source_id);
CREATE INDEX crm_tasks_status_due_idx ON public.crm_tasks (status, due_date);
CREATE INDEX crm_tasks_assigned_idx ON public.crm_tasks (assigned_to_email);

CREATE TRIGGER crm_tasks_set_updated_at
  BEFORE UPDATE ON public.crm_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
