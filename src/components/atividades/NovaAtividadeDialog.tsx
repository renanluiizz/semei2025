
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import type { Atividade } from '@/types/models';

const atividadeSchema = z.object({
  elder_id: z.string().min(1, 'Selecione um idoso'),
  activity_type: z.string().min(1, 'Tipo de atividade é obrigatório'),
  check_in_time: z.string().min(1, 'Data e hora são obrigatórias'),
  observation: z.string().optional(),
});

type AtividadeForm = z.infer<typeof atividadeSchema>;

interface NovaAtividadeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NovaAtividadeDialog({ open, onOpenChange }: NovaAtividadeDialogProps) {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();

  const { data: idosos } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<AtividadeForm>({
    resolver: zodResolver(atividadeSchema),
    defaultValues: {
      elder_id: '',
      activity_type: '',
      check_in_time: new Date().toISOString().slice(0, 16),
      observation: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AtividadeForm) => {
      const atividadeData: Omit<Atividade, 'id' | 'created_at' | 'elder'> = {
        elder_id: data.elder_id,
        staff_id: userProfile?.id || '',
        activity_type: data.activity_type,
        check_in_time: data.check_in_time,
        observation: data.observation || null,
      };
      return dbHelpers.createAtividade(atividadeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      toast.success('Atividade cadastrada com sucesso!');
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erro ao cadastrar atividade');
    }
  });

  const onSubmit = (data: AtividadeForm) => {
    createMutation.mutate(data);
  };

  const activityTypes = [
    'Fisioterapia',
    'Terapia Ocupacional',
    'Consulta Médica',
    'Atividade Social',
    'Recreação',
    'Educação',
    'Alimentação',
    'Higiene',
    'Medicação',
    'Outros'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Atividade</DialogTitle>
          <DialogDescription>
            Cadastre uma nova atividade para um idoso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="elder_id">Idoso *</Label>
            <Select onValueChange={(value) => form.setValue('elder_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um idoso" />
              </SelectTrigger>
              <SelectContent>
                {idosos?.map((idoso) => (
                  <SelectItem key={idoso.id} value={idoso.id}>
                    {idoso.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.elder_id && (
              <p className="text-sm text-red-500">{form.formState.errors.elder_id.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="activity_type">Tipo de Atividade *</Label>
            <Select onValueChange={(value) => form.setValue('activity_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de atividade" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.activity_type && (
              <p className="text-sm text-red-500">{form.formState.errors.activity_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="check_in_time">Data e Hora *</Label>
            <Input
              {...form.register('check_in_time')}
              id="check_in_time"
              type="datetime-local"
            />
            {form.formState.errors.check_in_time && (
              <p className="text-sm text-red-500">{form.formState.errors.check_in_time.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="observation">Observações</Label>
            <Textarea
              {...form.register('observation')}
              id="observation"
              placeholder="Observações sobre a atividade..."
              rows={3}
            />
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
              disabled={createMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
