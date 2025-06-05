
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';

export function useCPFValidation() {
  const { data: idososExistentes } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const checkCPFExists = (cpf: string): boolean => {
    if (!idososExistentes) return false;
    
    const cpfLimpo = cpf.replace(/\D/g, '');
    return idososExistentes.some(idoso => 
      idoso.cpf.replace(/\D/g, '') === cpfLimpo
    );
  };

  return {
    checkCPFExists,
    idososExistentes
  };
}
