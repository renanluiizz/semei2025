
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressStepProps {
  form: UseFormReturn<any>;
}

export function AddressStep({ form }: AddressStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="address">Endereço Completo</Label>
        <Input
          {...form.register('address')}
          id="address"
          placeholder="Rua, número, complemento"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <Select onValueChange={(value) => form.setValue('zone', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a zona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urbana">Urbana</SelectItem>
            <SelectItem value="rural">Rural</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="time_in_cabo_frio">Tempo em Cabo Frio</Label>
        <Input
          {...form.register('time_in_cabo_frio')}
          id="time_in_cabo_frio"
          placeholder="Ex: 10 anos, desde 1990, etc."
        />
      </div>
    </div>
  );
}
