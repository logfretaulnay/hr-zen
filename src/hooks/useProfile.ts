import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN'

const ROLE_LABEL_FR: Record<Role, string> = {
  EMPLOYEE: 'Employé',
  MANAGER: 'Manager',
  ADMIN: 'Administrateur'
}

interface Profile {
  name: string
  role: Role
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('user_id', session.user.id)
            .single()

          if (error) {
            console.error('Error fetching profile:', error)
          } else {
            setProfile(data)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const computedName = 
    profile?.name 
    ?? session?.user?.user_metadata?.full_name
    ?? session?.user?.user_metadata?.name
    ?? (session?.user?.email?.split('@')[0] ?? 'Utilisateur')

  return {
    fullName: computedName,
    role: profile?.role ?? 'EMPLOYEE',
    roleLabel: ROLE_LABEL_FR[profile?.role ?? 'EMPLOYEE'],
    loading
  }
}