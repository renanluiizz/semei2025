
// Interfaces temporárias para contornar erros de tipos até a sincronização do Supabase
export interface Staff {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'operator';
  created_at: string;
  updated_at: string;
}

export interface Elder {
  id: string;
  name: string;
  birth_date: string;
  birthplace?: string;
  marital_status?: string;
  father_name?: string;
  mother_name?: string;
  gender: 'masculino' | 'feminino' | 'outro';
  rg?: string;
  cpf: string;
  address?: string;
  neighborhood?: string;
  state?: string;
  zone?: string;
  age?: number;
  blood_type?: string;
  has_illness?: boolean;
  has_allergy?: boolean;
  medication_type?: string;
  health_plan?: string;
  phone?: string;
  mobile_phone?: string;
  emergency_phone?: string;
  guardian_name?: string;
  has_children?: boolean;
  family_constitution?: string;
  time_in_cabo_frio?: string;
  notes?: string;
  photo_url?: string;
  registration_date?: string;
  responsible_staff_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  elder_id: string;
  staff_id: string;
  activity_type: string;
  check_in_time: string;
  status?: 'presente' | 'falta' | 'ausencia_justificada';
  observation?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityType {
  id: string;
  name: string;
  description?: string;
  color?: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  table_name: string;
  operation: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
