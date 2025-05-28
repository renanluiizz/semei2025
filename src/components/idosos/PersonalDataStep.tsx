
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCPF } from '@/utils/cpfValidator';

interface PersonalDataStepProps {
  form: UseFormReturn<any>;
}

export function PersonalDataStep({ form }: PersonalDataStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            {...form.register('name')}
            id="name"
            placeholder="Nome completo do idoso"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="birth_date">Data de Nascimento *</Label>
          <Input
            {...form.register('birth_date')}
            id="birth_date"
            type="date"
          />
          {form.formState.errors.birth_date && (
            <p className="text-sm text-red-500">{form.formState.errors.birth_date.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gênero *</Label>
          <Select onValueChange={(value) => form.setValue('gender', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.gender && (
            <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            {...form.register('cpf')}
            id="cpf"
            placeholder="000.000.000-00"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              form.setValue('cpf', formatCPF(value));
            }}
          />
          {form.formState.errors.cpf && (
            <p className="text-sm text-red-500">{form.formState.errors.cpf.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rg">RG</Label>
          <Input
            {...form.register('rg')}
            id="rg"
            placeholder="00.000.000-0"
          />
        </div>

        <div>
          <Label htmlFor="marital_status">Estado Civil</Label>
          <Select onValueChange={(value) => form.setValue('marital_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="father_name">Nome do Pai</Label>
          <Input
            {...form.register('father_name')}
            id="father_name"
            placeholder="Nome completo do pai"
          />
        </div>

        <div>
          <Label htmlFor="mother_name">Nome da Mãe</Label>
          <Input
            {...form.register('mother_name')}
            id="mother_name"
            placeholder="Nome completo da mãe"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="birthplace">Naturalidade</Label>
        <Input
          {...form.register('birthplace')}
          id="birthplace"
          placeholder="Cidade e estado de nascimento"
        />
      </div>
    </div>
  );
}
