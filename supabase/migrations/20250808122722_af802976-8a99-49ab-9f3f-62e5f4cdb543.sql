-- Fix infinite recursion in RLS policies

-- 1. Drop problematic policies
DROP POLICY IF EXISTS admin_profiles_read ON public.profiles;
DROP POLICY IF EXISTS admin_profiles_write ON public.profiles;
DROP POLICY IF EXISTS manager_leaves ON leave_requests;
DROP POLICY IF EXISTS balances_self ON leave_balances;

-- 2. Create stable ADMIN policy for profiles (no recursion)
CREATE POLICY admin_profiles_all
  ON public.profiles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (true);

-- 3. MANAGER can read leave requests where they are approver
CREATE POLICY manager_leaves
  ON leave_requests
  FOR SELECT
  USING (approved_by = auth.uid());

-- 4. Users can read their own balances + ADMIN can read all
CREATE POLICY balances_self
  ON leave_balances
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'ADMIN'
    )
  );

-- 5. Ensure ADMIN can manage leave types and holidays
DROP POLICY IF EXISTS admin_types ON leave_types;
CREATE POLICY admin_types
  ON leave_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'ADMIN'
    )
  )
  WITH CHECK (true);