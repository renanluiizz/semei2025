
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, User } from 'lucide-react';
import { StaffMember } from '@/lib/staffManagement';

const staffSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().optional(),
  phone: z.string().optional(),
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

  return (
    <Card className="semei-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-blue-600" />
          {isEditing ? 'Editar Servidor' : 'Cadastrar Novo Servidor'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="semei-label">
                Nome Completo *
              </Label>
              <Input
                id="full_name"
                {...register('full_name')}
                className="semei-input"
                placeholder="Digite o nome completo"
              />
              {errors.full_name && (
                <p className="text-red-500 text-xs">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="semei-label">
                E-mail Institucional *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="semei-input"
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf" className="semei-label">
                CPF
              </Label>
              <Input
                id="cpf"
                {...register('cpf')}
                className="semei-input"
                placeholder="000.000.000-00"
                maxLength={14}
                disabled
              />
              <p className="text-xs text-gray-500">Campo será habilitado em futuras versões</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="semei-label">
                Telefone
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                className="semei-input"
                placeholder="(00) 00000-0000"
                disabled
              />
              <p className="text-xs text-gray-500">Campo será habilitado em futuras versões</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="semei-label">
                Cargo/Função
              </Label>
              <Input
                id="position"
                {...register('position')}
                className="semei-input"
                placeholder="Ex: Coordenador, Assistente Social"
                disabled
              />
              <p className="text-xs text-gray-500">Campo será habilitado em futuras versões</p>
            </div>

            <div className="space-y-2">
              <Label className="semei-label">
                Perfil de Acesso *
              </Label>
              <Select value={roleValue} onValueChange={(value) => setValue('role', value as 'admin' | 'operator')}>
                <SelectTrigger className="semei-input">
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-xs">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="semei-label">
                Status *
              </Label>
              <Select value={statusValue} onValueChange={(value) => setValue('status', value as 'active' | 'inactive')} disabled>
                <SelectTrigger className="semei-input">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Todos os usuários são criados como Ativos</p>
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password" className="semei-label">
                  Senha de Acesso *
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="semei-input"
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="semei-button-primary flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="semei-button-secondary flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
