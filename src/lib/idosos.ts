
import { supabase } from '@/integrations/supabase/client';
import { getCacheKey, getCache, setCache, clearCache } from './cache';
import type { Idoso } from '@/types/models';
import type { Elder } from '@/types/supabase-manual';

// Idosos database operations
export const idososHelpers = {
  getIdosos: async () => {
    const cacheKey = getCacheKey('idosos');
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    const { data, error } = await supabase
      .from('elders')
      .select('*')
      .order('name') as { data: Elder[] | null, error: any };
    
    if (data && !error) {
      setCache(cacheKey, data);
    }
    
    return { data: data as Idoso[], error };
  },

  getIdoso: async (id: string) => {
    const cacheKey = getCacheKey('idoso', id);
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    const { data, error } = await supabase
      .from('elders')
      .select('*')
      .eq('id', id)
      .maybeSingle() as { data: Elder | null, error: any };
    
    if (data && !error) {
      setCache(cacheKey, data);
    }
    
    return { data: data as Idoso | null, error };
  },

  createIdoso: async (idoso: Omit<Idoso, 'id' | 'created_at'>) => {
    // Map the data to match database schema
    const dbData = {
      name: idoso.name,
      birth_date: idoso.birth_date,
      cpf: idoso.cpf,
      gender: idoso.gender,
      birthplace: idoso.birthplace,
      marital_status: idoso.marital_status,
      father_name: idoso.father_name,
      mother_name: idoso.mother_name,
      rg: idoso.rg,
      address: idoso.address,
      neighborhood: idoso.neighborhood,
      state: idoso.state,
      zone: idoso.zone,
      age: idoso.age,
      blood_type: idoso.blood_type,
      has_illness: idoso.has_illness,
      has_allergy: idoso.has_allergy,
      medication_type: idoso.medication_type,
      health_plan: idoso.health_plan,
      phone: idoso.phone,
      mobile_phone: idoso.mobile_phone,
      emergency_phone: idoso.emergency_phone,
      guardian_name: idoso.guardian_name,
      has_children: idoso.has_children,
      family_constitution: idoso.family_constitution,
      time_in_cabo_frio: idoso.time_in_cabo_frio,
      notes: idoso.notes,
      photo_url: idoso.photo_url,
      registration_date: idoso.registration_date,
      responsible_staff_id: idoso.responsible_staff_id,
    };

    const { data, error } = await supabase
      .from('elders')
      .insert([dbData])
      .select()
      .single() as { data: Elder | null, error: any };
    
    // Limpar cache relacionado
    clearCache(getCacheKey('idosos'));
    
    return { data: data as Idoso, error };
  },

  updateIdoso: async (id: string, updates: Partial<Idoso>) => {
    const { data, error } = await supabase
      .from('elders')
      .update(updates)
      .eq('id', id)
      .select()
      .single() as { data: Elder | null, error: any };
    
    // Limpar cache relacionado
    clearCache(getCacheKey('idosos'));
    clearCache(getCacheKey('idoso', id));
    
    return { data: data as Idoso, error };
  },

  deleteIdoso: async (id: string) => {
    const { data, error } = await supabase
      .from('elders')
      .delete()
      .eq('id', id);
    
    // Limpar cache relacionado
    clearCache(getCacheKey('idosos'));
    clearCache(getCacheKey('idoso', id));
    
    return { data, error };
  },

  checkCPFExists: async (cpf: string) => {
    const { data, error } = await supabase
      .from('elders')
      .select('id')
      .eq('cpf', cpf)
      .maybeSingle() as { data: Elder | null, error: any };
    
    return { exists: !!data, error };
  },
};
