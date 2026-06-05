REVOKE SELECT (private_notes, internal_reference, agent_captador, agent_comercializador, notes_visibility) ON public.properties FROM anon;
REVOKE SELECT (private_notes, internal_reference, agent_captador, agent_comercializador, notes_visibility) ON public.properties FROM authenticated;
REVOKE SELECT (private_notes, internal_reference, agent_captador, agent_comercializador, notes_visibility) ON public.properties FROM PUBLIC;

-- Admins still need to read these via the service_role / dashboards.
GRANT SELECT (private_notes, internal_reference, agent_captador, agent_comercializador, notes_visibility) ON public.properties TO service_role;