
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Save, X } from 'lucide-react';
import type { Staff } from '@/types/supabase-manual';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword && (data.password?.length || 0) >= 6;
  }
  return true;
}, {
  message: "Senhas não coincidem ou são muito curtas (mínimo 6 caracteres)",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { userProfile } = useAuth();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: userProfile?.full_name || '',
      email: userProfile?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      // Atualizar dados na tabela staff
      const updates: any = {
        full_name: data.full_name,
        email: data.email,
      };

      const { error: staffError } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', userProfile?.id) as { error: any };

      if (staffError) throw staffError;

      // Se uma nova senha foi fornecida, atualizar a senha de autenticação
      if (data.password && data.password.trim() !== '') {
        const { error: authError } = await supabase.auth.updateUser({
          email: data.email,
          password: data.password,
        });

        if (authError) throw authError;
      } else {
        // Apenas atualizar o email se não há mudança de senha
        const { error: authError } = await supabase.auth.updateUser({
          email: data.email,
        });

        if (authError) throw authError;
      }

      return updates;
    },
    onSuccess: () => {
      toast.success('Perfil atualizado com sucesso!');
      form.reset({
        full_name: form.getValues('full_name'),
        email: form.getValues('email'),
        password: '',
        confirmPassword: '',
      });
      onOpenChange(false);
      // Recarregar a página para atualizar os dados do usuário
      window.location.reload();
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil: ' + (error.message || 'Erro desconhecido'));
    }
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Editar Perfil
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Atualize suas informações pessoais e senha
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Nome Completo *</Label>
            <Input
              {...form.register('full_name')}
              id="full_name"
              placeholder="Seu nome completo"
            />
            {form.formState.errors.full_name && (
              <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              {...form.register('email')}
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <Input
              {...form.register('password')}
              id="password"
              type="password"
              placeholder="Deixe em branco para manter a atual"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              {...form.register('confirmPassword')}
              id="confirmPassword"
              type="password"
              placeholder="Confirme a nova senha"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
