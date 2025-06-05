
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useCPFValidation } from '@/hooks/useCPFValidation';
import { useCreateIdoso } from '@/hooks/useCreateIdoso';
import { idosoSchema, type IdosoForm } from '@/schemas/idosoSchema';

export function useIdosoForm() {
  const { userProfile } = useAuth();
  const { checkCPFExists } = useCPFValidation();
  const createMutation = useCreateIdoso(checkCPFExists);

  const form = useForm<IdosoForm>({
    resolver: zodResolver(idosoSchema),
    defaultValues: {
      has_illness: false,
      has_allergy: false,
      has_children: false,
    },
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
