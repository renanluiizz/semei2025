
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { getCacheKey, getCache, setCache, clearCache } from './cache';
import type { Staff } from '@/types/supabase-manual';

export const staffHelpers = {
  getStaff: async () => {
    const cacheKey = getCacheKey('staff');
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    const { data, error } = await supabaseClient
      .from('staff')
      .select('*')
      .order('full_name');
    
    if (data && !error) {
      setCache(cacheKey, data);
    }
    
    return { data: data as Staff[], error };
  },

  createStaff: async (staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabaseClient
      .from('staff')
      .insert([staff])
      .select()
      .single();
    
    // Limpar cache relacionado
    clearCache(getCacheKey('staff'));
    
    return { data: data as Staff, error };
  },

  updateStaffProfile: async (id: string, updates: Partial<Staff>) => {
    const { data, error } = await supabaseClient
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    // Limpar cache relacionado
    clearCache(getCacheKey('staff'));
    
    return { data: data as Staff, error };
  },

  deleteStaff: async (id: string) => {
    const { data, error } = await supabaseClient
      .from('staff')
      .delete()
      .eq('id', id);
    
    // Limpar cache relacionado
    clearCache(getCacheKey('staff'));
    
    return { data, error };
  },
};
