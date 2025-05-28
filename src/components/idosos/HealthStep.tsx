
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface HealthStepProps {
  form: UseFormReturn<any>;
}

export function HealthStep({ form }: HealthStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="blood_type">Tipo Sanguíneo</Label>
          <Select onValueChange={(value) => form.setValue('blood_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="health_plan">Plano de Saúde</Label>
          <Input
            {...form.register('health_plan')}
            id="health_plan"
            placeholder="Nome do plano ou SUS"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="has_illness"
            checked={form.watch('has_illness')}
            onCheckedChange={(checked) => form.setValue('has_illness', checked as boolean)}
          />
          <Label htmlFor="has_illness">Possui alguma doença/comorbidade</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="has_allergy"
            checked={form.watch('has_allergy')}
            onCheckedChange={(checked) => form.setValue('has_allergy', checked as boolean)}
          />
          <Label htmlFor="has_allergy">Possui alguma alergia</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="has_children"
            checked={form.watch('has_children')}
            onCheckedChange={(checked) => form.setValue('has_children', checked as boolean)}
          />
          <Label htmlFor="has_children">Possui filhos</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="medication_type">Medicamentos em Uso</Label>
        <Textarea
          {...form.register('medication_type')}
          id="medication_type"
          placeholder="Liste os medicamentos e dosagens"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="family_constitution">Constituição Familiar</Label>
        <Textarea
          {...form.register('family_constitution')}
          id="family_constitution"
          placeholder="Descreva a família do idoso"
          rows={2}
        />
      </div>
    </div>
  );
}
