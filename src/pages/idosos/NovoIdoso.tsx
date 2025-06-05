import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, User, MapPin, Heart, Phone } from 'lucide-react';
import { validateCPF, formatCPF } from '@/utils/cpfValidator';
import { calculateAge } from '@/utils/dateUtils';
import { StepNavigation } from '@/components/idosos/StepNavigation';
import { PersonalDataStep } from '@/components/idosos/PersonalDataStep';
import { AddressStep } from '@/components/idosos/AddressStep';
import { HealthStep } from '@/components/idosos/HealthStep';
import { ContactsStep } from '@/components/idosos/ContactsStep';
import { FormActions } from '@/components/idosos/FormActions';
import type { Idoso } from '@/types/models';

const idosoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['masculino', 'feminino', 'outro']),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').refine(validateCPF, 'CPF inválido'),
  rg: z.string().optional(),
  birthplace: z.string().optional(),
  marital_status: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  state: z.string().optional(),
  zone: z.string().optional(),
  blood_type: z.string().optional(),
  has_illness: z.boolean().optional(),
  has_allergy: z.boolean().optional(),
  medication_type: z.string().optional(),
  health_plan: z.string().optional(),
  phone: z.string().optional(),
  mobile_phone: z.string().optional(),
  emergency_phone: z.string().optional(),
  guardian_name: z.string().optional(),
  has_children: z.boolean().optional(),
  family_constitution: z.string().optional(),
  time_in_cabo_frio: z.string().optional(),
  notes: z.string().optional(),
});

type IdosoForm = z.infer<typeof idosoSchema>;

const steps = [
  { id: 'pessoais', title: 'Dados Pessoais', icon: User },
  { id: 'endereco', title: 'Endereço', icon: MapPin },
  { id: 'saude', title: 'Saúde', icon: Heart },
  { id: 'contatos', title: 'Contatos', icon: Phone },
];

export function NovoIdoso() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDataStep form={form} />;
      case 1:
        return <AddressStep form={form} />;
      case 2:
        return <HealthStep form={form} />;
      case 3:
        return <ContactsStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/idosos')} className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cadastrar Novo Idoso</h1>
          <p className="text-slate-600 mt-1">Preencha os dados para cadastrar um novo idoso</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="modern-card">
        <CardContent className="p-8">
          <StepNavigation steps={steps} currentStep={currentStep} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-200/60">
              {renderStepContent()}
            </div>
            
            <FormActions
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              isSubmitting={createMutation.isPending}
              userProfile={userProfile}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
