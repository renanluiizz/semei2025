
import { z } from 'zod';
import { validateCPF } from '@/utils/cpfValidator';

export const idosoSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  gender: z.enum(['masculino', 'feminino', 'outro']),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos').refine(validateCPF, 'CPF inválido'),
  rg: z.string().optional(),
  birthplace: z.string().optional(),
  marital_status: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  state: z.string().optional(),
  zone: z.string().optional(),
  blood_type: z.string().optional(),
  has_illness: z.boolean().optional(),
  has_allergy: z.boolean().optional(),
  medication_type: z.string().optional(),
  health_plan: z.string().optional(),
  phone: z.string().optional(),
  mobile_phone: z.string().optional(),
  emergency_phone: z.string().optional(),
  guardian_name: z.string().optional(),
  has_children: z.boolean().optional(),
  family_constitution: z.string().optional(),
  time_in_cabo_frio: z.string().optional(),
  notes: z.string().optional(),
});

export type IdosoForm = z.infer<typeof idosoSchema>;
