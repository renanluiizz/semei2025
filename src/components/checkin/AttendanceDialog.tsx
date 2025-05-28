
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
import { Clock, Save, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const attendanceSchema = z.object({
  elder_id: z.string().min(1, 'Selecione um idoso'),
  activity_type: z.string().min(1, 'Tipo de atividade é obrigatório'),
  status: z.enum(['presente', 'falta', 'ausencia_justificada'], {
    required_error: 'Status de presença é obrigatório'
  }),
  observation: z.string().optional(),
});

type AttendanceForm = z.infer<typeof attendanceSchema>;

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceDialog({ open, onOpenChange }: AttendanceDialogProps) {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: idosos } = useQuery({
    queryKey: ['idosos'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getIdosos();
      if (error) throw error;
      return data;
    },
  });

  const { data: atividades } = useQuery({
    queryKey: ['atividades'],
    queryFn: async () => {
      const { data, error } = await dbHelpers.getAtividades();
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<AttendanceForm>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      elder_id: '',
      activity_type: '',
      status: 'presente',
      observation: '',
    },
  });

  const attendanceMutation = useMutation({
    mutationFn: async (data: AttendanceForm) => {
      const attendanceData = {
        elder_id: data.elder_id,
        staff_id: userProfile?.id || '',
        activity_type: data.activity_type,
        check_in_time: new Date().toISOString(),
        status: data.status,
        observation: data.observation || null,
      };
      return dbHelpers.createAtividade(attendanceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atividades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Presença registrada com sucesso!');
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error('Erro ao registrar presença: ' + error.message);
    }
  });

  const onSubmit = (data: AttendanceForm) => {
    attendanceMutation.mutate(data);
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

  const filteredIdosos = idosos?.filter(idoso => 
    idoso.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idoso.cpf.includes(searchTerm)
  ) || [];

  const checkTodayAttendance = (elderId: string) => {
    if (!atividades) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return atividades.find(atividade => {
      const attendanceDate = new Date(atividade.check_in_time);
      attendanceDate.setHours(0, 0, 0, 0);
      return atividade.elder_id === elderId && attendanceDate.getTime() === today.getTime();
    });
  };

  const selectedElderAttendance = form.watch('elder_id') ? checkTodayAttendance(form.watch('elder_id')) : null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      presente: { label: 'Presente', className: 'bg-green-100 text-green-800' },
      falta: { label: 'Falta', className: 'bg-red-100 text-red-800' },
      ausencia_justificada: { label: 'Ausência Justificada', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.presente;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Chamada de Presença
          </DialogTitle>
          <DialogDescription>
            Registre a presença, falta ou ausência justificada do idoso
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="elder_search">Buscar Idoso *</Label>
            <Input
              id="elder_search"
              placeholder="Digite o nome ou CPF do idoso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <Select onValueChange={(value) => form.setValue('elder_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um idoso" />
              </SelectTrigger>
              <SelectContent>
                {filteredIdosos.map((idoso) => (
                  <SelectItem key={idoso.id} value={idoso.id}>
                    <div className="flex flex-col">
                      <span>{idoso.name}</span>
                      <span className="text-xs text-gray-500">CPF: {idoso.cpf}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.elder_id && (
              <p className="text-sm text-red-500">{form.formState.errors.elder_id.message}</p>
            )}
            {selectedElderAttendance && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span>Presença de hoje:</span>
                  {getStatusBadge(selectedElderAttendance.status || 'presente')}
                </div>
              </div>
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
            <Label htmlFor="status">Status de Presença *</Label>
            <Select onValueChange={(value: 'presente' | 'falta' | 'ausencia_justificada') => form.setValue('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presente">Presente</SelectItem>
                <SelectItem value="falta">Falta</SelectItem>
                <SelectItem value="ausencia_justificada">Ausência Justificada</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="observation">Observações</Label>
            <Textarea
              {...form.register('observation')}
              id="observation"
              placeholder="Observações sobre a presença..."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">Responsável pela Chamada</Label>
            <p className="text-sm text-gray-600">{userProfile?.full_name || 'Usuário não identificado'}</p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setSearchTerm('');
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={attendanceMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {attendanceMutation.isPending ? 'Registrando...' : 'Registrar Presença'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
