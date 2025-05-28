
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
import { Clock, Save, QrCode } from 'lucide-react';
import { QRCodeGenerator } from './QRCodeGenerator';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

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

  const filteredIdosos = idosos?.filter(idoso => 
    idoso.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idoso.cpf.includes(searchTerm)
  ) || [];

  const checkTodayCheckIn = (elderId: string) => {
    if (!atividades) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return atividades.some(atividade => {
      const checkInDate = new Date(atividade.check_in_time);
      checkInDate.setHours(0, 0, 0, 0);
      return atividade.elder_id === elderId && checkInDate.getTime() === today.getTime();
    });
  };

  const selectedElderHasCheckIn = form.watch('elder_id') ? checkTodayCheckIn(form.watch('elder_id')) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Realizar Check-in
          </DialogTitle>
          <DialogDescription>
            Registre a presença do idoso em uma atividade
          </DialogDescription>
        </DialogHeader>

        {showQRCode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">QR Code para Check-in</h3>
              <Button variant="outline" onClick={() => setShowQRCode(false)}>
                Voltar ao Formulário
              </Button>
            </div>
            <QRCodeGenerator 
              data={{
                type: 'checkin',
                timestamp: Date.now(),
                location: window.location.origin
              }}
            />
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQRCode(true)}
                className="flex items-center gap-2"
              >
                <QrCode className="h-4 w-4" />
                Gerar QR Code
              </Button>
            </div>

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
              {selectedElderHasCheckIn && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  ⚠️ Este idoso já realizou check-in hoje
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
              <Label htmlFor="observation">Observações</Label>
              <Textarea
                {...form.register('observation')}
                id="observation"
                placeholder="Observações sobre o check-in..."
                rows={3}
              />
            </div>

            {/* Staff Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">Responsável pelo Check-in</Label>
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
                disabled={checkInMutation.isPending || selectedElderHasCheckIn}
              >
                <Save className="h-4 w-4 mr-2" />
                {checkInMutation.isPending ? 'Realizando...' : 'Confirmar Check-in'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
