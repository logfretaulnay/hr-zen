-- Fix recursive RLS policies and create new tables

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "admin_profiles_read" ON public.profiles;
DROP POLICY IF EXISTS "admin_profiles_write" ON public.profiles;

-- 2. Create proper admin policies for profiles
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

CREATE POLICY "admin_profiles_write" ON public.profiles
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
)
WITH CHECK (true);

-- 3. Create manager policy for leave requests
CREATE POLICY "manager_leaves" ON public.leave_requests
FOR SELECT 
USING (approved_by = auth.uid());

-- 4. Create self balances policy
CREATE POLICY "self_balances" ON public.leave_balances
FOR SELECT 
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
);

-- 5. Create admin policies for leave types
CREATE POLICY "admin_types" ON public.leave_types
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
)
WITH CHECK (true);

-- 6. Create app_settings table for branding
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Admin can manage app settings
CREATE POLICY "admin_app_settings" ON public.app_settings
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
)
WITH CHECK (true);

-- Everyone can read app settings
CREATE POLICY "read_app_settings" ON public.app_settings
FOR SELECT 
USING (true);

-- 7. Insert default branding settings
INSERT INTO public.app_settings (key, value) VALUES
('branding', jsonb_build_object(
  'logo_url', null,
  'header_text', 'HRFlow – Gestion des congés',
  'header_bg', '#ffffff',
  'header_fg', '#111827',
  'header_font_size', 20
))
ON CONFLICT (key) DO NOTHING;

-- 8. Create storage bucket for branding
INSERT INTO storage.buckets (id, name, public) 
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Create storage policies for branding bucket
CREATE POLICY "Public branding access" ON storage.objects
FOR SELECT 
USING (bucket_id = 'branding');

CREATE POLICY "Admin branding upload" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'branding' 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
);

CREATE POLICY "Admin branding update" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'branding' 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
);

CREATE POLICY "Admin branding delete" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'branding' 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
  )
);