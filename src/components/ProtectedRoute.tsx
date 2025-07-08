
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui/page-loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'operator';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userProfile, loading, initialized } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - user:', user?.email || 'no user', 'loading:', loading, 'initialized:', initialized, 'userProfile:', userProfile);

  // Show loading while auth is initializing or loading
  if (!initialized || loading) {
    return <PageLoading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && userProfile && userProfile.role !== requiredRole) {
    console.log('User does not have required role, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
}
