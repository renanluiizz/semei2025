
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, User, Shield } from 'lucide-react';
import { StaffMember } from '@/lib/staffManagement';

const staffSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().optional().refine((cpf) => {
    if (!cpf || cpf === '') return true;
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.length === 11;
  }, 'CPF deve ter 11 dígitos'),
  phone: z.string().optional().refine((phone) => {
    if (!phone || phone === '') return true;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  }, 'Telefone inválido'),
  position: z.string().optional(),
  role: z.enum(['admin', 'operator'], { required_error: 'Selecione um cargo' }),
  status: z.enum(['active', 'inactive'], { required_error: 'Selecione um status' }),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormProps {
  staff?: StaffMember;
  onSubmit: (data: StaffFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function StaffForm({ staff, onSubmit, onCancel, loading = false }: StaffFormProps) {
  const isEditing = !!staff;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: staff ? {
      full_name: staff.full_name,
      email: staff.email,
      cpf: staff.cpf || '',
      phone: staff.phone || '',
      position: staff.position || '',
      role: staff.role,
      status: staff.status,
    } : {
      role: 'operator',
      status: 'active',
    }
  });

  const roleValue = watch('role');
  const statusValue = watch('status');

  const formatCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-white/20 rounded-lg">
              <User className="h-6 w-6" />
            </div>
            {isEditing ? 'Editar Servidor' : 'Cadastrar Novo Servidor'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="full_name"
                  {...register('full_name')}
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite o nome completo"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  E-mail Institucional *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="cpf" className="text-sm font-semibold text-gray-700">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  {...register('cpf')}
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  onChange={(e) => {
                    const formatted = formatCpf(e.target.value);
                    setValue('cpf', formatted);
                  }}
                />
                {errors.cpf && (
                  <p className="text-red-500 text-sm">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="(00) 00000-0000"
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setValue('phone', formatted);
                  }}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="position" className="text-sm font-semibold text-gray-700">
                  Cargo/Função
                </Label>
                <Input
                  id="position"
                  {...register('position')}
                  className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: Coordenador, Assistente Social"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Perfil de Acesso *
                </Label>
                <Select value={roleValue} onValueChange={(value) => setValue('role', value as 'admin' | 'operator')}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">Operador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Status *
                </Label>
                <Select value={statusValue} onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}>
                  <SelectTrigger className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status.message}</p>
                )}
              </div>

              {!isEditing && (
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Senha de Acesso *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="h-12 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 sm:flex-none h-12 px-8 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
