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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('name, role')
            .eq('user_id', user.id)
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

  return {
    fullName: profile?.name ?? 'Utilisateur',
    role: profile?.role ?? 'EMPLOYEE',
    roleLabel: ROLE_LABEL_FR[profile?.role ?? 'EMPLOYEE'],
    loading
  }
}