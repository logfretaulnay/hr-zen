-- Create notifications table
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Trigger function for leave request notifications
CREATE OR REPLACE FUNCTION public.handle_leave_request_notification()
RETURNS TRIGGER AS $$
DECLARE
  employee_name TEXT;
BEGIN
  -- Get employee name
  SELECT name INTO employee_name FROM public.profiles WHERE user_id = NEW.user_id;
  
  IF TG_OP = 'INSERT' THEN
    -- Notify managers when new request is created
    INSERT INTO public.notifications (user_id, title, body)
    SELECT 
      p.user_id,
      'Nouvelle demande de congé',
      employee_name || ' a soumis une nouvelle demande de congé'
    FROM public.profiles p 
    WHERE p.role IN ('MANAGER', 'ADMIN');
    
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    -- Notify employee when status changes
    INSERT INTO public.notifications (user_id, title, body)
    VALUES (
      NEW.user_id,
      CASE 
        WHEN NEW.status = 'APPROVED' THEN 'Demande approuvée'
        WHEN NEW.status = 'REJECTED' THEN 'Demande refusée'
        ELSE 'Statut de demande mis à jour'
      END,
      CASE 
        WHEN NEW.status = 'APPROVED' THEN 'Votre demande de congé a été approuvée'
        WHEN NEW.status = 'REJECTED' THEN 'Votre demande de congé a été refusée' || COALESCE(': ' || NEW.manager_comment, '')
        ELSE 'Le statut de votre demande a été mis à jour'
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER leave_request_notification_trigger
  AFTER INSERT OR UPDATE ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_leave_request_notification();

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;