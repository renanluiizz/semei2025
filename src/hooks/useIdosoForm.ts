
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dbHelpers } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { formatCPF } from '@/utils/cpfValidator';
import { calculateAge } from '@/utils/dateUtils';
import { idosoSchema, type IdosoForm } from '@/schemas/idosoSchema';
import type { Idoso } from '@/types/models';

export function useIdosoForm() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  // Verificar CPFs existentes
  const { data: idososExistentes } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<IdosoForm>({
    resolver: zodResolver(idosoSchema),
    defaultValues: {
      has_illness: false,
      has_allergy: false,
      has_children: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: IdosoForm) => {
      // Verificar se CPF já existe
      const cpfLimpo = data.cpf.replace(/\D/g, '');
      const cpfExiste = idososExistentes?.some(idoso => 
        idoso.cpf.replace(/\D/g, '') === cpfLimpo
      );

      if (cpfExiste) {
        throw new Error('CPF já cadastrado no sistema');
      }

      const idosoData: Omit<Idoso, 'id' | 'created_at'> = {
        name: data.name,
        birth_date: data.birth_date,
        gender: data.gender,
        cpf: formatCPF(data.cpf),
        rg: data.rg || null,
        birthplace: data.birthplace || null,
        marital_status: data.marital_status || null,
        father_name: data.father_name || null,
        mother_name: data.mother_name || null,
        address: data.address || null,
        neighborhood: data.neighborhood || null,
        state: data.state || null,
        zone: data.zone || null,
        age: calculateAge(data.birth_date),
        blood_type: data.blood_type || null,
        has_illness: data.has_illness || false,
        has_allergy: data.has_allergy || false,
        medication_type: data.medication_type || null,
        health_plan: data.health_plan || null,
        phone: data.phone || null,
        mobile_phone: data.mobile_phone || null,
        emergency_phone: data.emergency_phone || null,
        guardian_name: data.guardian_name || null,
        has_children: data.has_children || false,
        family_constitution: data.family_constitution || null,
        time_in_cabo_frio: data.time_in_cabo_frio || null,
        notes: data.notes || null,
        photo_url: null,
        registration_date: new Date().toISOString(),
        responsible_staff_id: userProfile?.id || null,
      };
      
      return dbHelpers.createIdoso(idosoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idosos'] });
      toast.success('Idoso cadastrado com sucesso!');
      navigate('/idosos');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar idoso');
    }
  });

  const onSubmit = (data: IdosoForm) => {
    createMutation.mutate(data);
  };

  return {
    form,
    createMutation,
    onSubmit,
    userProfile
  };
}
