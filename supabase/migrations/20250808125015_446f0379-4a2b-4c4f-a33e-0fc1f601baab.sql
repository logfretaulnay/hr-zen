-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND profiles.role = 'ADMIN'
  );
$$;

-- Drop problematic policy and recreate with security definer function
DROP POLICY IF EXISTS admin_profiles_all ON public.profiles;

CREATE POLICY admin_profiles_all
  ON public.profiles
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (true);