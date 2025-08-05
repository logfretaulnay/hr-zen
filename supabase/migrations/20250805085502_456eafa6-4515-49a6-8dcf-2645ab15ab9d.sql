-- Fonction pour synchroniser le rôle depuis profiles vers auth.users metadata
CREATE OR REPLACE FUNCTION sync_role_to_metadata()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Mettre à jour le user_metadata avec le rôle depuis profiles
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    to_jsonb(NEW.role)::jsonb
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger pour synchroniser automatiquement le rôle
CREATE TRIGGER trg_sync_role
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION sync_role_to_metadata();

-- Synchroniser les rôles existants
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'),
  '{role}',
  to_jsonb(p.role)::jsonb
)
FROM public.profiles p 
WHERE auth.users.id = p.user_id;