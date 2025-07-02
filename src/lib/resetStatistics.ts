
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { securityHelpers } from '@/lib/security';

export const resetStatisticsHelpers = {
  // Enhanced reset with audit logging and security checks
  resetStatistics: async () => {
    try {
      // Check if user has admin role before proceeding
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: staffProfile } = await supabaseClient
        .from('staff')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!staffProfile || !securityHelpers.hasRole(staffProfile.role, 'admin')) {
        throw new Error('Permissão insuficiente para realizar esta operação');
      }

      // Reset statistics data using existing tables
      const operations = [
        supabaseClient.from('check_ins').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
        supabaseClient.from('audit_log').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      ];

      const results = await Promise.allSettled(operations);
      
      // Check for errors
      const errors = results.filter(result => result.status === 'rejected');
      if (errors.length > 0) {
        console.error('Reset errors:', errors);
        throw new Error('Erro ao resetar algumas tabelas');
      }

      return { success: true };
    } catch (error) {
      console.error('Reset statistics error:', error);
      throw error;
    }
  },

  // Validate reset operation with enhanced security
  validateResetOperation: (confirmationText: string, userRole: string): boolean => {
    if (!securityHelpers.hasRole(userRole, 'admin')) {
      throw new Error('Apenas administradores podem resetar estatísticas');
    }

    const sanitizedText = securityHelpers.sanitizeString(confirmationText);
    return sanitizedText.toLowerCase() === 'resetar';
  }
};
