CREATE TABLE public.storage_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  bucket text NOT NULL,
  object_path text,
  action text NOT NULL,
  success boolean NOT NULL,
  was_admin boolean NOT NULL,
  user_id uuid,
  user_email text,
  error_message text,
  ip_address text,
  user_agent text
);

CREATE INDEX idx_storage_audit_log_created_at ON public.storage_audit_log (created_at DESC);
CREATE INDEX idx_storage_audit_log_bucket ON public.storage_audit_log (bucket);
CREATE INDEX idx_storage_audit_log_user_id ON public.storage_audit_log (user_id);

ALTER TABLE public.storage_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view storage audit log"
ON public.storage_audit_log
FOR SELECT
TO authenticated
USING (public.is_admin_user());
