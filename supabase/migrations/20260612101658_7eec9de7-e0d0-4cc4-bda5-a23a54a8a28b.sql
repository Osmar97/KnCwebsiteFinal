
-- 1. Partners: restrict reads to admins
DROP POLICY IF EXISTS "Partners auth read" ON public.partners;
CREATE POLICY "Partners admin read" ON public.partners
  FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- 2. Course resources: gate paid resources behind enrollment/purchase
DROP POLICY IF EXISTS "Course resources read" ON public.course_resources;
CREATE POLICY "Course resources read" ON public.course_resources
  FOR SELECT TO authenticated
  USING (
    unlock_type = 'free'
    OR public.is_admin_user()
    OR EXISTS (
      SELECT 1 FROM public.course_enrollments e
      WHERE e.course_id = course_resources.course_id AND e.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.course_purchases p
      WHERE p.course_id = course_resources.course_id
        AND p.user_id = auth.uid()
        AND p.payment_status = 'paid'
    )
  );

-- 3. Lesson attachments: gate behind enrollment/purchase of parent course
DROP POLICY IF EXISTS "Lesson attachments read" ON public.lesson_attachments;
CREATE POLICY "Lesson attachments read" ON public.lesson_attachments
  FOR SELECT TO authenticated
  USING (
    public.is_admin_user()
    OR EXISTS (
      SELECT 1
      FROM public.lessons l
      JOIN public.modules m ON m.id = l.module_id
      WHERE l.id = lesson_attachments.lesson_id
        AND (
          EXISTS (SELECT 1 FROM public.course_enrollments e WHERE e.course_id = m.course_id AND e.user_id = auth.uid())
          OR EXISTS (SELECT 1 FROM public.course_purchases p WHERE p.course_id = m.course_id AND p.user_id = auth.uid() AND p.payment_status = 'paid')
        )
    )
  );

-- 4a. Remove the unrestricted insert that bypasses validation
DROP POLICY IF EXISTS "tour_custom_quote_requests_anon_insert" ON public.tour_custom_quote_requests;

-- 4b. Tighten the public update so anon callers can only attach a clarity-call
--     slot to a brand-new request that does not yet have one, and can only set
--     the status to 'call_requested'. Limit UPDATE privileges to those two
--     columns so other fields cannot be modified through this path.
DROP POLICY IF EXISTS "Public can attach call slot" ON public.tour_custom_quote_requests;
REVOKE UPDATE ON public.tour_custom_quote_requests FROM anon, authenticated;
GRANT UPDATE (clarity_call_slot_id, status) ON public.tour_custom_quote_requests TO anon, authenticated;
CREATE POLICY "Public can attach call slot" ON public.tour_custom_quote_requests
  FOR UPDATE TO anon, authenticated
  USING (status = 'new' AND clarity_call_slot_id IS NULL)
  WITH CHECK (status = 'call_requested' AND clarity_call_slot_id IS NOT NULL);

-- Re-grant full UPDATE to authenticated admins via the existing "Admins update
-- custom quotes" policy by giving the role full column UPDATE privileges back.
-- Admin role check is enforced at the policy layer.
GRANT UPDATE ON public.tour_custom_quote_requests TO authenticated;
