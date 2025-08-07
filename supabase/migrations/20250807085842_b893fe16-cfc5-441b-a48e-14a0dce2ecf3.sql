-- Nouvelles policies RLS pour permettre aux admins de gérer tous les profils

-- Policy pour que les admins puissent lire tous les profils
CREATE POLICY "admin_profiles_read" ON public.profiles
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
);

-- Policy pour que les admins puissent modifier tous les profils
CREATE POLICY "admin_profiles_write" ON public.profiles
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
)
WITH CHECK (true);