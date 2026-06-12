-- Restore missing privileges on tour_custom_quote_requests so the public form,
-- clarity-call slot booking, and admin dashboard continue to work after the
-- earlier security tightening. RLS still enforces validation/admin gating.

-- Public/anon: only INSERT (validated by RLS WITH CHECK)
GRANT INSERT ON public.tour_custom_quote_requests TO anon;

-- Authenticated users: INSERT (same RLS), SELECT/DELETE gated to admins via RLS
GRANT INSERT, SELECT, DELETE ON public.tour_custom_quote_requests TO authenticated;

-- Column-scoped UPDATE: only the two fields involved in attaching a clarity
-- call slot are writable by anon/authenticated. Admin policy still allows
-- full updates because we also grant table-level UPDATE to authenticated below.
GRANT UPDATE (clarity_call_slot_id, status) ON public.tour_custom_quote_requests TO anon;
GRANT UPDATE ON public.tour_custom_quote_requests TO authenticated;

-- Service role (edge functions) keeps full access.
GRANT ALL ON public.tour_custom_quote_requests TO service_role;