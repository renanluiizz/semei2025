
import { securityHelpers } from '@/lib/security';

// Re-export security helpers for backward compatibility
export function validateCPF(cpf: string): boolean {
  return securityHelpers.validateCPF(cpf);
}

export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
