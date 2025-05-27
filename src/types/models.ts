export interface Idoso {
  id: string;
  created_at: string;
  
  // Dados pessoais
  name: string;
  birth_date: string;
  birthplace?: string;
  marital_status?: string;
  father_name?: string;
  mother_name?: string;
  gender: 'masculino' | 'feminino' | 'outro';
  
  // Documentação
  rg?: string;
  cpf: string;
  
  // Endereço
  address?: string;
  neighborhood?: string;
  state?: string;
  zone?: string;
  
  // Saúde
  age?: number; // Agora calculada automaticamente
  blood_type?: string;
  has_illness?: boolean;
  has_allergy?: boolean;
  medication_type?: string;
  health_plan?: string;
  
  // Contatos
  phone?: string;
  mobile_phone?: string;
  emergency_phone?: string;
  guardian_name?: string;
  
  // Outros
  has_children?: boolean;
  family_constitution?: string;
  time_in_cabo_frio?: string;
  notes?: string;
  photo_url?: string;
  registration_date?: string;
  responsible_staff_id?: string;
}

export interface Atividade {
  id: string;
  created_at: string;
  
  elder_id: string;
  staff_id: string;
  activity_type: string;
  check_in_time: string;
  observation?: string;
  
  // Relacionamentos
  elder?: { name: string };
  staff?: { full_name: string }; // Adicionado para mostrar quem fez o check-in
}

export interface Usuario {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'operator';
  created_at: string;
}

export interface DashboardStats {
  total_idosos: number;
  idosos_ativos: number;
  atividades_mes: number;
  aniversariantes_mes: Idoso[];
  distribuicao_idade: {
    faixa: string;
    quantidade: number;
  }[];
  atividades_recentes: Atividade[];
}

export interface FormStep {
  id: string;
  title: string;
  isValid: boolean;
  isCompleted: boolean;
}
