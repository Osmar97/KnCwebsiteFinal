
DROP POLICY IF EXISTS "Anyone can submit custom quote" ON public.tour_custom_quote_requests;
CREATE POLICY "Anyone can submit custom quote"
ON public.tour_custom_quote_requests
FOR INSERT
WITH CHECK (
  char_length(coalesce(first_name, '')) BETWEEN 1 AND 100
  AND char_length(coalesce(last_name, '')) BETWEEN 1 AND 100
  AND char_length(coalesce(email, '')) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(coalesce(notes, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can submit waitlist" ON public.tour_waitlist_requests;
CREATE POLICY "Anyone can submit waitlist"
ON public.tour_waitlist_requests
FOR INSERT
WITH CHECK (
  char_length(coalesce(full_name, '')) BETWEEN 1 AND 200
  AND char_length(coalesce(email, '')) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(coalesce(notes, '')) <= 5000
);

REVOKE EXECUTE ON FUNCTION public.get_tour_availability() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_tour_availability() TO service_role;
