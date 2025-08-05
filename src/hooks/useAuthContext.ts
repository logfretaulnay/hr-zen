import { useAuth as useAuthOriginal } from '@/contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthOriginal();
  
  return {
    user: auth.user,
    profile: auth.profile,
    role: auth.role || 'EMPLOYEE',
    signOut: auth.signOut,
    loading: auth.loading,
    isAdmin: auth.role === 'ADMIN',
    isManager: auth.role === 'MANAGER' || auth.role === 'ADMIN',
    isEmployee: !!auth.role
  };
};