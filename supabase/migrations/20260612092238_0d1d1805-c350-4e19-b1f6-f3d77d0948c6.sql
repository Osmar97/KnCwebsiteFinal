
-- Grant required privileges so anon/authenticated can submit public forms,
-- while admin-only SELECT/UPDATE remain protected by existing RLS policies.
GRANT INSERT ON public.tour_custom_quote_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.tour_custom_quote_requests TO authenticated;
GRANT ALL ON public.tour_custom_quote_requests TO service_role;

GRANT INSERT ON public.tour_waitlist_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.tour_waitlist_requests TO authenticated;
GRANT ALL ON public.tour_waitlist_requests TO service_role;

-- Allow the booking flow's follow-up "book a clarity call" update from the
-- same anonymous session (row id is an unguessable UUID acting as the token).
DROP POLICY IF EXISTS "Public can attach call slot" ON public.tour_custom_quote_requests;
CREATE POLICY "Public can attach call slot"
ON public.tour_custom_quote_requests
FOR UPDATE
TO anon, authenticated
USING (status IN ('new','call_requested'))
WITH CHECK (status IN ('new','call_requested'));
