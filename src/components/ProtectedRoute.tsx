import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && role !== requiredRole && 
      !(requiredRole === 'MANAGER' && role === 'ADMIN')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}