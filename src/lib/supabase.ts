
import { createClient } from '@supabase/supabase-js';
import type { Idoso, Atividade, Usuario, DashboardStats } from '@/types/models';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      .from('idosos')
      .select('*')
      .eq('ativo', true)
      .order('nome');
    return { data: data as Idoso[], error };
  },

  getIdoso: async (id: string) => {
    const { data, error } = await supabase
      .from('idosos')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Idoso, error };
  },

  createIdoso: async (idoso: Omit<Idoso, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('idosos')
      .insert([idoso])
      .select()
      .single();
    return { data: data as Idoso, error };
  },

  updateIdoso: async (id: string, updates: Partial<Idoso>) => {
    const { data, error } = await supabase
      .from('idosos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Idoso, error };
  },

  deleteIdoso: async (id: string) => {
    const { data, error } = await supabase
      .from('idosos')
      .update({ ativo: false, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { data, error };
  },

  // Atividades
  getAtividades: async (idosoId?: string) => {
    let query = supabase
      .from('atividades')
      .select(`
        *,
        idoso:idosos(nome)
      `)
      .order('data_atividade', { ascending: false });

    if (idosoId) {
      query = query.eq('idoso_id', idosoId);
    }

    const { data, error } = await query;
    return { data: data as Atividade[], error };
  },

  createAtividade: async (atividade: Omit<Atividade, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('atividades')
      .insert([atividade])
      .select()
      .single();
    return { data: data as Atividade, error };
  },

  updateAtividade: async (id: string, updates: Partial<Atividade>) => {
    const { data, error } = await supabase
      .from('atividades')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Atividade, error };
  },

  deleteAtividade: async (id: string) => {
    const { data, error } = await supabase
      .from('atividades')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Dashboard
  getDashboardStats: async (): Promise<{ data: DashboardStats | null, error: any }> => {
    try {
      // Buscar estatísticas básicas
      const { data: idosos, error: idososError } = await supabase
        .from('idosos')
        .select('*')
        .eq('ativo', true);

      if (idososError) throw idososError;

      // Aniversariantes do mês
      const currentMonth = new Date().getMonth() + 1;
      const aniversariantes = idosos?.filter(idoso => {
        const birthMonth = new Date(idoso.data_nascimento).getMonth() + 1;
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
        const idade = new Date().getFullYear() - new Date(idoso.data_nascimento).getFullYear();
        if (idade >= 60 && idade < 70) distribuicaoIdade[0].quantidade++;
        else if (idade >= 70 && idade < 80) distribuicaoIdade[1].quantidade++;
        else if (idade >= 80 && idade < 90) distribuicaoIdade[2].quantidade++;
        else if (idade >= 90) distribuicaoIdade[3].quantidade++;
      });

      // Atividades do mês
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: atividadesMes } = await supabase
        .from('atividades')
        .select('*')
        .gte('data_atividade', firstDayOfMonth);

      // Atividades recentes
      const { data: atividadesRecentes } = await supabase
        .from('atividades')
        .select(`
          *,
          idoso:idosos(nome)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      const stats: DashboardStats = {
        total_idosos: idosos?.length || 0,
        idosos_ativos: idosos?.filter(i => i.ativo).length || 0,
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
