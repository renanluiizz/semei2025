
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
import { Clock, Save } from 'lucide-react';

const checkInSchema = z.object({
  elder_id: z.string().min(1, 'Selecione um idoso'),
  activity_type: z.string().min(1, 'Tipo de atividade é obrigatório'),
  observation: z.string().optional(),
});

type CheckInForm = z.infer<typeof checkInSchema>;

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckInDialog({ open, onOpenChange }: CheckInDialogProps) {
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

  const form = useForm<CheckInForm>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      elder_id: '',
      activity_type: '',
      observation: '',
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async (data: CheckInForm) => {
      const checkInData = {
        elder_id: data.elder_id,
        staff_id: userProfile?.id || '',
        activity_type: data.activity_type,
        check_in_time: new Date().toISOString(),
        observation: data.observation || null,
      };
      return dbHelpers.createAtividade(checkInData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Check-in realizado com sucesso!');
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Erro ao realizar check-in: ' + error.message);
    }
  });

  const onSubmit = (data: CheckInForm) => {
    checkInMutation.mutate(data);
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
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Realizar Check-in
          </DialogTitle>
          <DialogDescription>
            Registre a presença do idoso em uma atividade
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
            <Label htmlFor="observation">Observações</Label>
            <Textarea
              {...form.register('observation')}
              id="observation"
              placeholder="Observações sobre o check-in..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={checkInMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {checkInMutation.isPending ? 'Realizando...' : 'Confirmar Check-in'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
