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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, User, MapPin, Heart, Phone } from 'lucide-react';
import { validateCPF, formatCPF } from '@/utils/cpfValidator';
import { calculateAge } from '@/utils/dateUtils';
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
      case 0: // Dados Pessoais
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  {...form.register('name')}
                  id="name"
                  placeholder="Nome completo do idoso"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="birth_date">Data de Nascimento *</Label>
                <Input
                  {...form.register('birth_date')}
                  id="birth_date"
                  type="date"
                />
                {form.formState.errors.birth_date && (
                  <p className="text-sm text-red-500">{form.formState.errors.birth_date.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gênero *</Label>
                <Select onValueChange={(value) => form.setValue('gender', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  {...form.register('cpf')}
                  id="cpf"
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    form.setValue('cpf', formatCPF(value));
                  }}
                />
                {form.formState.errors.cpf && (
                  <p className="text-sm text-red-500">{form.formState.errors.cpf.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  {...form.register('rg')}
                  id="rg"
                  placeholder="00.000.000-0"
                />
              </div>

              <div>
                <Label htmlFor="marital_status">Estado Civil</Label>
                <Select onValueChange={(value) => form.setValue('marital_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="father_name">Nome do Pai</Label>
                <Input
                  {...form.register('father_name')}
                  id="father_name"
                  placeholder="Nome completo do pai"
                />
              </div>

              <div>
                <Label htmlFor="mother_name">Nome da Mãe</Label>
                <Input
                  {...form.register('mother_name')}
                  id="mother_name"
                  placeholder="Nome completo da mãe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="birthplace">Naturalidade</Label>
              <Input
                {...form.register('birthplace')}
                id="birthplace"
                placeholder="Cidade e estado de nascimento"
              />
            </div>
          </div>
        );

      case 1: // Endereço
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Endereço Completo</Label>
              <Input
                {...form.register('address')}
                id="address"
                placeholder="Rua, número, complemento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  {...form.register('neighborhood')}
                  id="neighborhood"
                  placeholder="Nome do bairro"
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  {...form.register('state')}
                  id="state"
                  placeholder="Ex: Rio de Janeiro"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zone">Zona</Label>
              <Select onValueChange={(value) => form.setValue('zone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a zona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urbana">Urbana</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time_in_cabo_frio">Tempo em Cabo Frio</Label>
              <Input
                {...form.register('time_in_cabo_frio')}
                id="time_in_cabo_frio"
                placeholder="Ex: 10 anos, desde 1990, etc."
              />
            </div>
          </div>
        );

      case 2: // Saúde
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
                <Select onValueChange={(value) => form.setValue('blood_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="health_plan">Plano de Saúde</Label>
                <Input
                  {...form.register('health_plan')}
                  id="health_plan"
                  placeholder="Nome do plano ou SUS"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="has_illness"
                  checked={form.watch('has_illness')}
                  onCheckedChange={(checked) => form.setValue('has_illness', checked as boolean)}
                />
                <Label htmlFor="has_illness">Possui alguma doença/comorbidade</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="has_allergy"
                  checked={form.watch('has_allergy')}
                  onCheckedChange={(checked) => form.setValue('has_allergy', checked as boolean)}
                />
                <Label htmlFor="has_allergy">Possui alguma alergia</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="has_children"
                  checked={form.watch('has_children')}
                  onCheckedChange={(checked) => form.setValue('has_children', checked as boolean)}
                />
                <Label htmlFor="has_children">Possui filhos</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="medication_type">Medicamentos em Uso</Label>
              <Textarea
                {...form.register('medication_type')}
                id="medication_type"
                placeholder="Liste os medicamentos e dosagens"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="family_constitution">Constituição Familiar</Label>
              <Textarea
                {...form.register('family_constitution')}
                id="family_constitution"
                placeholder="Descreva a família do idoso"
                rows={2}
              />
            </div>
          </div>
        );

      case 3: // Contatos
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefone Fixo</Label>
                <Input
                  {...form.register('phone')}
                  id="phone"
                  placeholder="(22) 0000-0000"
                />
              </div>

              <div>
                <Label htmlFor="mobile_phone">Celular</Label>
                <Input
                  {...form.register('mobile_phone')}
                  id="mobile_phone"
                  placeholder="(22) 00000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardian_name">Nome do Responsável</Label>
                <Input
                  {...form.register('guardian_name')}
                  id="guardian_name"
                  placeholder="Nome completo do responsável"
                />
              </div>

              <div>
                <Label htmlFor="emergency_phone">Telefone de Emergência</Label>
                <Input
                  {...form.register('emergency_phone')}
                  id="emergency_phone"
                  placeholder="(22) 00000-0000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações Gerais</Label>
              <Textarea
                {...form.register('notes')}
                id="notes"
                placeholder="Informações adicionais importantes sobre o idoso"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/idosos')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastrar Novo Idoso</h1>
          <p className="text-gray-500 mt-1">Preencha os dados para cadastrar um novo idoso</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-primary' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>

              {currentStep === steps.length - 1 ? (
                <div className="space-y-4">
                  {userProfile && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Responsável pelo cadastro:</strong> {userProfile.full_name}
                      </p>
                    </div>
                  )}
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Cadastrando...' : 'Finalizar Cadastro'}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
