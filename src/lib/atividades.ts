
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import { getCacheKey, getCache, setCache, clearCache } from './cache';
import type { Atividade, Activity } from '@/types/models';
import type { CheckIn, Elder, Staff } from '@/types/supabase-manual';

// Atividades database operations
export const atividadesHelpers = {
  getAtividades: async (idosoId?: string) => {
    const cacheKey = getCacheKey('atividades', idosoId);
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    let query = supabaseClient
      .from('check_ins')
      .select(`
        *,
        elder:elders(name),
        staff:staff(full_name)
      `)
      .order('check_in_time', { ascending: false });

    if (idosoId) {
      query = query.eq('elder_id', idosoId);
    }

    const { data, error } = await query;
    
    if (data && !error) {
      // Transformar os dados para o formato compatível com ReportGenerator
      const transformedData: Activity[] = data.map((item: any) => ({
        id: item.id,
        data_atividade: item.check_in_time,
        tipo_atividade: item.activity_type,
        observacoes: item.observation || '',
        idoso_id: item.elder_id,
        idoso: item.elder ? {
          id: item.elder_id,
          nome: item.elder.name,
          sexo: 'não informado' // Será preenchido com dados reais quando necessário
        } : undefined
      }));
      
      setCache(cacheKey, transformedData);
      return { data: transformedData, error: null };
    }
    
    return { data: [], error };
  },

  createAtividade: async (atividade: Omit<Atividade, 'id' | 'created_at'>) => {
    const dbData = {
      elder_id: atividade.elder_id,
      staff_id: atividade.staff_id,
      activity_type: atividade.activity_type,
      check_in_time: atividade.check_in_time,
      observation: atividade.observation,
    };

    const { data, error } = await supabaseClient
      .from('check_ins')
      .insert([dbData])
      .select()
      .single();
    
    // Limpar cache relacionado
    clearCache(getCacheKey('atividades'));
    
    return { data: data as Atividade, error };
  },

  updateAtividade: async (id: string, updates: Partial<Atividade>) => {
    const { data, error } = await supabaseClient
      .from('check_ins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    // Limpar cache relacionado
    clearCache(getCacheKey('atividades'));
    
    return { data: data as Atividade, error };
  },

  deleteAtividade: async (id: string) => {
    const { data, error } = await supabaseClient
      .from('check_ins')
      .delete()
      .eq('id', id);
    
    // Limpar cache relacionado
    clearCache(getCacheKey('atividades'));
    
    return { data, error };
  },
};
