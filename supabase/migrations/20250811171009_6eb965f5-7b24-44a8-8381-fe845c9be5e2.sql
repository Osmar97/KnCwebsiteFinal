-- First, drop the existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can update posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the authenticated user's email matches admin emails
  RETURN auth.email() IN (
    'ismael@kingsncompany.com',
    'joey@kingsncompany.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create secure RLS policies that require admin authentication
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated admins can create posts" 
ON public.posts 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_user());

CREATE POLICY "Only authenticated admins can update posts" 
ON public.posts 
FOR UPDATE 
TO authenticated
USING (public.is_admin_user());

CREATE POLICY "Only authenticated admins can delete posts" 
ON public.posts 
FOR DELETE 
TO authenticated
USING (public.is_admin_user());