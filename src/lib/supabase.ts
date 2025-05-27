
import { supabase } from '@/integrations/supabase/client';
import type { Idoso, Atividade, Usuario, DashboardStats } from '@/types/models';

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

// Database helpers
export const dbHelpers = {
  // Idosos
  getIdosos: async () => {
    const { data, error } = await supabase
      .from('elders')
      .select('*')
      .order('name');
    return { data: data as Idoso[], error };
  },

  getIdoso: async (id: string) => {
    const { data, error } = await supabase
      .from('elders')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Idoso, error };
  },

  createIdoso: async (idoso: Omit<Idoso, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('elders')
      .insert([idoso])
      .select()
      .single();
    return { data: data as Idoso, error };
  },

  updateIdoso: async (id: string, updates: Partial<Idoso>) => {
    const { data, error } = await supabase
      .from('elders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Idoso, error };
  },

  deleteIdoso: async (id: string) => {
    const { data, error } = await supabase
      .from('elders')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Atividades
  getAtividades: async (idosoId?: string) => {
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
    return { data: data as Atividade[], error };
  },

  createAtividade: async (atividade: Omit<Atividade, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('check_ins')
      .insert([atividade])
      .select()
      .single();
    return { data: data as Atividade, error };
  },

  updateAtividade: async (id: string, updates: Partial<Atividade>) => {
    const { data, error } = await supabase
      .from('check_ins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Atividade, error };
  },

  deleteAtividade: async (id: string) => {
    const { data, error } = await supabase
      .from('check_ins')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Dashboard
  getDashboardStats: async (): Promise<{ data: DashboardStats | null, error: any }> => {
    try {
      // Buscar estatísticas básicas
      const { data: idosos, error: idososError } = await supabase
        .from('elders')
        .select('*');

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

      // Atividades do mês
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: atividadesMes } = await supabase
        .from('check_ins')
        .select('*')
        .gte('check_in_time', firstDayOfMonth);

      // Atividades recentes
      const { data: atividadesRecentes } = await supabase
        .from('check_ins')
        .select(`
          *,
          elder:elders(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const stats: DashboardStats = {
        total_idosos: idosos?.length || 0,
        idosos_ativos: idosos?.length || 0,
        atividades_mes: atividadesMes?.length || 0,
        aniversariantes_mes: aniversariantes,
        distribuicao_idade: distribuicaoIdade,
        atividades_recentes: atividadesRecentes || [],
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// Re-export the supabase client for convenience
export { supabase };
