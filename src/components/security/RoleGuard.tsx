
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { securityHelpers } from '@/lib/security';
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

  if (!securityHelpers.hasRole(userProfile.role, requiredRole)) {
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
