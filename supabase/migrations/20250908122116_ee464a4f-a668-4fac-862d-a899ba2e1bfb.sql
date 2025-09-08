-- Fix recursive profiles policies by using security definer helper functions
-- 1) Create is_manager helper (is_admin already exists)
CREATE OR REPLACE FUNCTION public.is_manager(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND profiles.role = 'MANAGER'
  );
$$;

-- 2) Replace recursive SELECT policy
DROP POLICY IF EXISTS "Managers and admins can view all profiles" ON public.profiles;
CREATE POLICY "Managers and admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()) OR public.is_manager(auth.uid()));

-- 3) Replace recursive INSERT policy
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));
