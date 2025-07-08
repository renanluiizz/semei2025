
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';

interface RoleGuardProps {
  requiredRole: 'admin' | 'operator';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ requiredRole, children, fallback }: RoleGuardProps) {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return fallback || (
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar logado para acessar esta funcionalidade.
        </AlertDescription>
      </Alert>
    );
  }

  const hasRole = (userRole: string, required: string) => {
    if (required === 'admin') {
      return userRole === 'admin';
    }
    // Operators and admins can access operator features
    return userRole === 'admin' || userRole === 'operator';
  };

  if (!hasRole(userProfile.role, requiredRole)) {
    return fallback || (
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          Você não tem permissão para acessar esta funcionalidade. 
          Permissão necessária: {requiredRole === 'admin' ? 'Administrador' : 'Operador'}.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
