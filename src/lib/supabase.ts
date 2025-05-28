
// Main supabase library with re-exports for backward compatibility
import { supabase } from '@/integrations/supabase/client';

// Re-export all helpers for backward compatibility
export { authHelpers } from './auth';
export { idososHelpers } from './idosos';
export { atividadesHelpers } from './atividades';
export { staffHelpers } from './staff';
export { dashboardHelpers } from './dashboard';

// Consolidated database helpers object for backward compatibility
export const dbHelpers = {
  // Idosos
  getIdosos: async () => (await import('./idosos')).idososHelpers.getIdosos(),
  getIdoso: async (id: string) => (await import('./idosos')).idososHelpers.getIdoso(id),
  createIdoso: async (idoso: any) => (await import('./idosos')).idososHelpers.createIdoso(idoso),
  updateIdoso: async (id: string, updates: any) => (await import('./idosos')).idososHelpers.updateIdoso(id, updates),
  deleteIdoso: async (id: string) => (await import('./idosos')).idososHelpers.deleteIdoso(id),
  checkCPFExists: async (cpf: string) => (await import('./idosos')).idososHelpers.checkCPFExists(cpf),
  
  // Atividades
  getAtividades: async (idosoId?: string) => (await import('./atividades')).atividadesHelpers.getAtividades(idosoId),
  createAtividade: async (atividade: any) => (await import('./atividades')).atividadesHelpers.createAtividade(atividade),
  updateAtividade: async (id: string, updates: any) => (await import('./atividades')).atividadesHelpers.updateAtividade(id, updates),
  deleteAtividade: async (id: string) => (await import('./atividades')).atividadesHelpers.deleteAtividade(id),
  
  // Staff
  updateStaffProfile: async (id: string, updates: any) => (await import('./staff')).staffHelpers.updateStaffProfile(id, updates),
  
  // Dashboard
  getDashboardStats: async () => (await import('./dashboard')).dashboardHelpers.getDashboardStats(),
};

// Re-export the supabase client for convenience
export { supabase };
