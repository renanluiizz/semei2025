import { supabase } from '@/integrations/supabase/client';
import type { Idoso, Atividade, Usuario, DashboardStats } from '@/types/models';

// Cache para requests frequentes
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCacheKey(key: string, params?: any): string {
  return params ? `${key}_${JSON.stringify(params)}` : key;
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

function getCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Auth helpers
export const authHelpers = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};

// Database helpers com cache otimizado
export const dbHelpers = {
  // Idosos
  getIdosos: async () => {
    const cacheKey = getCacheKey('idosos');
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    const { data, error } = await supabase
      .from('elders')
      .select('*')
      .order('name');
    
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
      .maybeSingle();
    
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
      .single();
    
    // Limpar cache relacionado
    cache.delete(getCacheKey('idosos'));
    
    return { data: data as Idoso, error };
  },

  updateIdoso: async (id: string, updates: Partial<Idoso>) => {
    const { data, error } = await supabase
      .from('elders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    // Limpar cache relacionado
    cache.delete(getCacheKey('idosos'));
    cache.delete(getCacheKey('idoso', id));
    
    return { data: data as Idoso, error };
  },

  deleteIdoso: async (id: string) => {
    const { data, error } = await supabase
      .from('elders')
      .delete()
      .eq('id', id);
    
    // Limpar cache relacionado
    cache.delete(getCacheKey('idosos'));
    cache.delete(getCacheKey('idoso', id));
    
    return { data, error };
  },

  // Atividades
  getAtividades: async (idosoId?: string) => {
    const cacheKey = getCacheKey('atividades', idosoId);
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    let query = supabase
      .from('check_ins')
      .select(`
        *,
        elder:elders(name)
      `)
      .order('check_in_time', { ascending: false });

    if (idosoId) {
      query = query.eq('elder_id', idosoId);
    }

    const { data, error } = await query;
    
    if (data && !error) {
      setCache(cacheKey, data);
    }
    
    return { data: data as Atividade[], error };
  },

  createAtividade: async (atividade: Omit<Atividade, 'id' | 'created_at'>) => {
    const dbData = {
      elder_id: atividade.elder_id,
      staff_id: atividade.staff_id,
      activity_type: atividade.activity_type,
      check_in_time: atividade.check_in_time,
      observation: atividade.observation,
    };

    const { data, error } = await supabase
      .from('check_ins')
      .insert([dbData])
      .select()
      .single();
    
    // Limpar cache relacionado
    cache.delete(getCacheKey('atividades'));
    
    return { data: data as Atividade, error };
  },

  updateAtividade: async (id: string, updates: Partial<Atividade>) => {
    const { data, error } = await supabase
      .from('check_ins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    // Limpar cache relacionado
    cache.delete(getCacheKey('atividades'));
    
    return { data: data as Atividade, error };
  },

  deleteAtividade: async (id: string) => {
    const { data, error } = await supabase
      .from('check_ins')
      .delete()
      .eq('id', id);
    
    // Limpar cache relacionado
    cache.delete(getCacheKey('atividades'));
    
    return { data, error };
  },

  // Dashboard com cache otimizado
  getDashboardStats: async (): Promise<{ data: DashboardStats | null, error: any }> => {
    const cacheKey = getCacheKey('dashboard-stats');
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    try {
      // Usar Promise.all para requests paralelos
      const [idososResult, atividadesMesResult, atividadesRecentesResult] = await Promise.all([
        supabase.from('elders').select('*'),
        supabase.from('check_ins').select('*').gte('check_in_time', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('check_ins').select(`*, elder:elders(name)`).order('created_at', { ascending: false }).limit(5)
      ]);

      const { data: idosos, error: idososError } = idososResult;
      if (idososError) throw idososError;

      // Aniversariantes do mês
      const currentMonth = new Date().getMonth() + 1;
      const aniversariantes = idosos?.filter(idoso => {
        const birthMonth = new Date(idoso.birth_date).getMonth() + 1;
        return birthMonth === currentMonth;
      }) || [];

      // Distribuição por idade
      const distribuicaoIdade = [
        { faixa: '60-69 anos', quantidade: 0 },
        { faixa: '70-79 anos', quantidade: 0 },
        { faixa: '80-89 anos', quantidade: 0 },
        { faixa: '90+ anos', quantidade: 0 },
      ];

      idosos?.forEach(idoso => {
        const idade = new Date().getFullYear() - new Date(idoso.birth_date).getFullYear();
        if (idade >= 60 && idade < 70) distribuicaoIdade[0].quantidade++;
        else if (idade >= 70 && idade < 80) distribuicaoIdade[1].quantidade++;
        else if (idade >= 80 && idade < 90) distribuicaoIdade[2].quantidade++;
        else if (idade >= 90) distribuicaoIdade[3].quantidade++;
      });

      const stats: DashboardStats = {
        total_idosos: idosos?.length || 0,
        idosos_ativos: idosos?.length || 0,
        atividades_mes: atividadesMesResult.data?.length || 0,
        aniversariantes_mes: aniversariantes as Idoso[],
        distribuicao_idade: distribuicaoIdade,
        atividades_recentes: (atividadesRecentesResult.data || []) as Atividade[],
      };

      setCache(cacheKey, stats);
      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Re-export the supabase client for convenience
export { supabase };
