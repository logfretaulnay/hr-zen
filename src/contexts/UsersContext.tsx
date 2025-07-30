import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
  employeeId?: string
  startDate?: string
  annualLeave?: number
  rttDays?: number
}

interface UsersContextType {
  users: User[]
  addUser: (user: Omit<User, 'id' | 'status' | 'lastLogin'>) => void
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

const initialUsers: User[] = [
  {
    id: 1,
    name: "Marie Dupont",
    email: "marie.dupont@company.com",
    role: "employee",
    department: "Développement",
    status: "active",
    lastLogin: "2024-01-25"
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@company.com",
    role: "manager",
    department: "Design",
    status: "active",
    lastLogin: "2024-01-24"
  },
  {
    id: 3,
    name: "Sophie Blanc",
    email: "sophie.blanc@company.com",
    role: "admin",
    department: "RH",
    status: "active",
    lastLogin: "2024-01-25"
  }
]

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : initialUsers
  })

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  const addUser = (userData: Omit<User, 'id' | 'status' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      status: 'active',
      lastLogin: new Date().toISOString().split('T')[0]
    }
    setUsers(prev => [...prev, newUser])
  }

  return (
    <UsersContext.Provider value={{ users, addUser }}>
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