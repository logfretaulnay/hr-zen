-- Create enum types
CREATE TYPE public.user_role AS ENUM ('EMPLOYEE', 'MANAGER', 'ADMIN');
CREATE TYPE public.request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- Create profiles table for user data (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'EMPLOYEE',
  department TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  annual_leave_days INTEGER DEFAULT 25,
  rtt_days INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_types table
CREATE TABLE public.leave_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  is_paid BOOLEAN DEFAULT true,
  max_days_per_year INTEGER,
  requires_approval BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_id UUID NOT NULL REFERENCES public.leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  half_day_start BOOLEAN DEFAULT false,
  half_day_end BOOLEAN DEFAULT false,
  total_days DECIMAL(3,1) NOT NULL,
  status request_status NOT NULL DEFAULT 'PENDING',
  reason TEXT,
  manager_comment TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create holidays table
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  label TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_balances table
CREATE TABLE public.leave_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  annual_leave_total INTEGER DEFAULT 25,
  annual_leave_used DECIMAL(3,1) DEFAULT 0,
  rtt_total INTEGER DEFAULT 10,
  rtt_used DECIMAL(3,1) DEFAULT 0,
  sick_leave_used DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, year)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers and admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('MANAGER', 'ADMIN')
    )
  );

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
    )
  );

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for leave_types
CREATE POLICY "Everyone can view leave types" ON public.leave_types
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage leave types" ON public.leave_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
    )
  );

-- RLS Policies for leave_requests
CREATE POLICY "Users can view their own requests" ON public.leave_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers and admins can view all requests" ON public.leave_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('MANAGER', 'ADMIN')
    )
  );

CREATE POLICY "Users can create their own requests" ON public.leave_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers and admins can update requests" ON public.leave_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('MANAGER', 'ADMIN')
    )
  );

CREATE POLICY "Users can update their pending requests" ON public.leave_requests
  FOR UPDATE USING (auth.uid() = user_id AND status = 'PENDING')
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for holidays
CREATE POLICY "Everyone can view holidays" ON public.holidays
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage holidays" ON public.holidays
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role = 'ADMIN'
    )
  );

-- RLS Policies for leave_balances
CREATE POLICY "Users can view their own balance" ON public.leave_balances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers and admins can view all balances" ON public.leave_balances
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('MANAGER', 'ADMIN')
    )
  );

CREATE POLICY "System can manage balances" ON public.leave_balances
  FOR ALL USING (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    'EMPLOYEE'
  );
  
  -- Create initial leave balance for current year
  INSERT INTO public.leave_balances (user_id, year)
  VALUES (NEW.id, EXTRACT(YEAR FROM CURRENT_DATE));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_balances_updated_at
  BEFORE UPDATE ON public.leave_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default leave types
INSERT INTO public.leave_types (label, color, is_paid, max_days_per_year) VALUES
('Congés Payés', '#10B981', true, 25),
('RTT', '#3B82F6', true, 10),
('Congé Maladie', '#EF4444', true, null),
('Congé Maternité', '#8B5CF6', true, null),
('Congé Paternité', '#06B6D4', true, null),
('Formation', '#F59E0B', true, null),
('Télétravail', '#6B7280', false, null);

-- Insert default holidays
INSERT INTO public.holidays (date, label, is_recurring) VALUES
('2024-01-01', 'Jour de l''An', true),
('2024-05-01', 'Fête du Travail', true),
('2024-05-08', 'Fête de la Victoire', true),
('2024-07-14', 'Fête Nationale', true),
('2024-08-15', 'Assomption', true),
('2024-11-01', 'Toussaint', true),
('2024-11-11', 'Armistice', true),
('2024-12-25', 'Noël', true);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Managers can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('MANAGER', 'ADMIN')
    )
  );