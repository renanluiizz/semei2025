
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactsStepProps {
  form: UseFormReturn<any>;
}

export function ContactsStep({ form }: ContactsStepProps) {
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
}
