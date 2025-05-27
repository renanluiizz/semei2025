
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { PageLoading } from '@/components/ui/page-loading';
import type { Idoso } from '@/types/models';

const editIdosoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['masculino', 'feminino', 'outro']),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
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

type EditIdosoForm = z.infer<typeof editIdosoSchema>;

export default function EditIdoso() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: idoso, isLoading } = useQuery({
    queryKey: ['idoso', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');
      const { data, error } = await dbHelpers.getIdoso(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const form = useForm<EditIdosoForm>({
    resolver: zodResolver(editIdosoSchema),
    values: idoso ? {
      name: idoso.name,
      birth_date: idoso.birth_date,
      gender: idoso.gender,
      cpf: idoso.cpf,
      rg: idoso.rg || '',
      birthplace: idoso.birthplace || '',
      marital_status: idoso.marital_status || '',
      father_name: idoso.father_name || '',
      mother_name: idoso.mother_name || '',
      address: idoso.address || '',
      neighborhood: idoso.neighborhood || '',
      state: idoso.state || '',
      zone: idoso.zone || '',
      blood_type: idoso.blood_type || '',
      has_illness: idoso.has_illness || false,
      has_allergy: idoso.has_allergy || false,
      medication_type: idoso.medication_type || '',
      health_plan: idoso.health_plan || '',
      phone: idoso.phone || '',
      mobile_phone: idoso.mobile_phone || '',
      emergency_phone: idoso.emergency_phone || '',
      guardian_name: idoso.guardian_name || '',
      has_children: idoso.has_children || false,
      family_constitution: idoso.family_constitution || '',
      time_in_cabo_frio: idoso.time_in_cabo_frio || '',
      notes: idoso.notes || '',
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (data: EditIdosoForm) => {
      if (!id) throw new Error('ID não fornecido');
      return dbHelpers.updateIdoso(id, data as Partial<Idoso>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idosos'] });
      queryClient.invalidateQueries({ queryKey: ['idoso', id] });
      toast.success('Idoso atualizado com sucesso!');
      navigate(`/idosos/${id}`);
    },
    onError: () => {
      toast.error('Erro ao atualizar idoso');
    }
  });

  const onSubmit = (data: EditIdosoForm) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!idoso) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/idosos')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Idoso não encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              O idoso solicitado não foi encontrado.
            </p>
            <Button onClick={() => navigate('/idosos')}>
              Voltar à Lista
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/idosos/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Idoso</h1>
          <p className="text-gray-500 mt-1">Edite os dados de {idoso.name}</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <Label htmlFor="gender">Gênero *</Label>
                  <Select onValueChange={(value) => form.setValue('gender', value as any)} value={form.watch('gender')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf">CPF *</Label>
                  <Input
                    {...form.register('cpf')}
                    id="cpf"
                    placeholder="000.000.000-00"
                  />
                  {form.formState.errors.cpf && (
                    <p className="text-sm text-red-500">{form.formState.errors.cpf.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    {...form.register('rg')}
                    id="rg"
                    placeholder="00.000.000-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  {...form.register('address')}
                  id="address"
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <Select onValueChange={(value) => form.setValue('zone', value)} value={form.watch('zone') || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a zona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urbana">Urbana</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Saúde */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Saúde</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
                <Select onValueChange={(value) => form.setValue('blood_type', value)} value={form.watch('blood_type') || ''}>
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
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardHeader>
              <CardTitle>Contatos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/idosos/${id}`)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
