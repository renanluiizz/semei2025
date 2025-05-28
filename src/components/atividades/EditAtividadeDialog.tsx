
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
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
  status: z.enum(['presente', 'falta', 'ausencia_justificada']).optional(),
  observation: z.string().optional(),
});

type AtividadeForm = z.infer<typeof atividadeSchema>;

interface EditAtividadeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atividade: Atividade | null;
}

export function EditAtividadeDialog({ open, onOpenChange, atividade }: EditAtividadeDialogProps) {
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
      check_in_time: '',
      status: 'presente',
      observation: '',
    },
  });

  useEffect(() => {
    if (atividade && open) {
      form.reset({
        elder_id: atividade.elder_id,
        activity_type: atividade.activity_type,
        check_in_time: new Date(atividade.check_in_time).toISOString().slice(0, 16),
        status: (atividade as any).status || 'presente',
        observation: atividade.observation || '',
      });
    }
  }, [atividade, open, form]);

  const updateMutation = useMutation({
    mutationFn: (data: AtividadeForm) => {
      if (!atividade) throw new Error('Atividade não encontrada');
      
      return dbHelpers.updateAtividade(atividade.id, {
        elder_id: data.elder_id,
        activity_type: data.activity_type,
        check_in_time: data.check_in_time,
        status: data.status,
        observation: data.observation || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      toast.success('Atividade atualizada com sucesso!');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Erro ao atualizar atividade');
    }
  });

  const onSubmit = (data: AtividadeForm) => {
    updateMutation.mutate(data);
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

  if (!atividade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Atividade</DialogTitle>
          <DialogDescription>
            Edite os dados da atividade
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="elder_id">Idoso *</Label>
            <Select onValueChange={(value) => form.setValue('elder_id', value)} value={form.watch('elder_id')}>
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
            <Select onValueChange={(value) => form.setValue('activity_type', value)} value={form.watch('activity_type')}>
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
            <Label htmlFor="status">Status de Presença</Label>
            <Select onValueChange={(value: 'presente' | 'falta' | 'ausencia_justificada') => form.setValue('status', value)} value={form.watch('status')}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presente">Presente</SelectItem>
                <SelectItem value="falta">Falta</SelectItem>
                <SelectItem value="ausencia_justificada">Ausência Justificada</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
