
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { getCacheKey, getCache, setCache, clearCache } from './cache';
import type { ActivityType } from '@/types/supabase-manual';

// Export the type for backward compatibility
export type TipoAtividade = ActivityType;

export const tiposAtividadeHelpers = {
  getTiposAtividade: async () => {
    const cacheKey = getCacheKey('tipos-atividade');
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    const { data, error } = await supabaseClient
      .from('activity_types')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (data && !error) {
      setCache(cacheKey, data);
    }
    
    return { data: data as ActivityType[], error };
  },

  createTipoAtividade: async (tipo: Omit<ActivityType, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabaseClient
      .from('activity_types')
      .insert([tipo])
      .select()
      .single();
    
    // Limpar cache relacionado
    clearCache(getCacheKey('tipos-atividade'));
    
    return { data: data as ActivityType, error };
  },

  updateTipoAtividade: async (id: string, updates: Partial<ActivityType>) => {
    const { data, error } = await supabaseClient
      .from('activity_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    // Limpar cache relacionado
    clearCache(getCacheKey('tipos-atividade'));
    
    return { data: data as ActivityType, error };
  },

  deleteTipoAtividade: async (id: string) => {
    const { data, error } = await supabaseClient
      .from('activity_types')
      .update({ is_active: false })
      .eq('id', id);
    
    // Limpar cache relacionado
    clearCache(getCacheKey('tipos-atividade'));
    
    return { data, error };
  },
};
