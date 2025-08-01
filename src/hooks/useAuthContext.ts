import { useAuth as useAuthOriginal } from '@/contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthOriginal();
  
  return {
    user: auth.user,
    profile: auth.profile,
    role: auth.profile?.role || 'EMPLOYEE',
    signOut: auth.signOut,
    loading: auth.loading,
    isAdmin: auth.profile?.role === 'ADMIN',
    isManager: auth.profile?.role === 'MANAGER' || auth.profile?.role === 'ADMIN',
    isEmployee: !!auth.profile
  };
};