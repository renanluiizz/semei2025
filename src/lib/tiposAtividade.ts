
import { supabase } from '@/integrations/supabase/client';
import { getCacheKey, getCache, setCache, clearCache } from './cache';

export interface TipoAtividade {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  criado_em: string;
}

// Tipos de atividade database operations
export const tiposAtividadeHelpers = {
  getTiposAtividade: async () => {
    const cacheKey = getCacheKey('tipos-atividade');
    const cached = getCache(cacheKey);
    if (cached) return { data: cached, error: null };

    // Como não temos tabela de tipos de atividade no Supabase,
    // vamos usar dados mockados que persistem no localStorage
    const localData = localStorage.getItem('tipos-atividade');
    
    if (localData) {
      const tipos = JSON.parse(localData);
      setCache(cacheKey, tipos);
      return { data: tipos, error: null };
    }

    // Dados padrão se não houver nada no localStorage
    const defaultTipos: TipoAtividade[] = [
      {
        id: '1',
        nome: 'Exercícios Físicos',
        descricao: 'Atividades de exercício físico adaptado para idosos',
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: '2',
        nome: 'Artesanato',
        descricao: 'Oficinas de trabalhos manuais e artesanato',
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: '3',
        nome: 'Música',
        descricao: 'Atividades musicais e terapia através da música',
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: '4',
        nome: 'Bingo',
        descricao: 'Jogos de bingo para entretenimento e socialização',
        ativo: true,
        criado_em: new Date().toISOString()
      },
      {
        id: '5',
        nome: 'Fisioterapia',
        descricao: 'Sessões de fisioterapia e reabilitação',
        ativo: true,
        criado_em: new Date().toISOString()
      }
    ];

    localStorage.setItem('tipos-atividade', JSON.stringify(defaultTipos));
    setCache(cacheKey, defaultTipos);
    return { data: defaultTipos, error: null };
  },

  createTipoAtividade: async (tipo: Omit<TipoAtividade, 'id' | 'criado_em'>) => {
    try {
      const { data: existingTipos } = await tiposAtividadeHelpers.getTiposAtividade();
      
      const newTipo: TipoAtividade = {
        id: Date.now().toString(),
        nome: tipo.nome,
        descricao: tipo.descricao,
        ativo: true,
        criado_em: new Date().toISOString()
      };

      const updatedTipos = [...(existingTipos || []), newTipo];
      localStorage.setItem('tipos-atividade', JSON.stringify(updatedTipos));
      
      // Limpar cache
      clearCache(getCacheKey('tipos-atividade'));
      
      return { data: newTipo, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  updateTipoAtividade: async (id: string, updates: Partial<TipoAtividade>) => {
    try {
      const { data: existingTipos } = await tiposAtividadeHelpers.getTiposAtividade();
      
      const updatedTipos = existingTipos?.map(tipo => 
        tipo.id === id ? { ...tipo, ...updates } : tipo
      ) || [];

      localStorage.setItem('tipos-atividade', JSON.stringify(updatedTipos));
      
      // Limpar cache
      clearCache(getCacheKey('tipos-atividade'));
      
      const updatedTipo = updatedTipos.find(tipo => tipo.id === id);
      return { data: updatedTipo, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  deleteTipoAtividade: async (id: string) => {
    try {
      const { data: existingTipos } = await tiposAtividadeHelpers.getTiposAtividade();
      
      const updatedTipos = existingTipos?.filter(tipo => tipo.id !== id) || [];
      localStorage.setItem('tipos-atividade', JSON.stringify(updatedTipos));
      
      // Limpar cache
      clearCache(getCacheKey('tipos-atividade'));
      
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};
