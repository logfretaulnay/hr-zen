-- Fix RLS policy for profiles without recursion
DROP POLICY IF EXISTS admin_profiles_all ON public.profiles;

CREATE POLICY admin_profiles_all
  ON public.profiles
  FOR ALL
  USING (
    (
      SELECT role FROM public.profiles AS p
      WHERE p.user_id = auth.uid()
    ) = 'ADMIN'
  )
  WITH CHECK (true);