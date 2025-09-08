import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface User {
  id: string
  user_id: string
  name: string
  email: string
  role: string
  department: string
  job_title?: string
  phone?: string
  status: string
  lastLogin: string
  employeeId?: string
  startDate?: string
  annualLeave?: number
  rttDays?: number
}

interface UsersContextType {
  users: User[]
  loading: boolean
  refetch: () => Promise<void>
  addUser: (user: Omit<User, 'id' | 'user_id' | 'status' | 'lastLogin'>) => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, name, email, role, department, job_title, phone, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des utilisateurs",
          variant: "destructive",
        })
        return
      }

      if (data) {
        const formattedUsers: User[] = data.map(profile => ({
          id: profile.id,
          user_id: profile.user_id,
          name: profile.name,
          email: profile.email,
          role: profile.role.toLowerCase(),
          department: profile.department || '',
          job_title: profile.job_title,
          phone: profile.phone,
          status: 'active',
          lastLogin: '2024-01-25' // Mock data for now
        }))
        setUsers(formattedUsers)
      }
    } catch (error: any) {
      console.error('Error in fetchUsers:', error)
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des utilisateurs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const addUser = (userData: Omit<User, 'id' | 'user_id' | 'status' | 'lastLogin'>) => {
    // This will be handled by the NewUser component directly with Supabase
    fetchUsers() // Refetch users after adding
  }

  return (
    <UsersContext.Provider value={{ users, loading, refetch: fetchUsers, addUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export const useUsers = () => {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}