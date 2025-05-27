
export interface Idoso {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Dados pessoais
  nome: string;
  data_nascimento: string;
  naturalidade: string;
  estado_civil: 'solteiro' | 'casado' | 'viuvo' | 'divorciado';
  escolaridade: string;
  profissao: string;
  
  // Documentação
  rg: string;
  cpf: string;
  nis: string;
  titulo_eleitor?: string;
  
  // Endereço
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  zona: 'urbana' | 'rural';
  cep: string;
  
  // Saúde
  comorbidades: string[];
  medicamentos: string[];
  mobilidade: 'independente' | 'parcial' | 'dependente';
  observacoes_saude?: string;
  
  // Contatos
  telefone?: string;
  responsavel_nome?: string;
  responsavel_telefone?: string;
  responsavel_parentesco?: string;
  
  // Sistema
  ativo: boolean;
  usuario_cadastro: string;
}

export interface Atividade {
  id: string;
  created_at: string;
  updated_at: string;
  
  idoso_id: string;
  titulo: string;
  descricao: string;
  data_atividade: string;
  responsavel: string;
  tipo: 'social' | 'saude' | 'educacional' | 'lazer' | 'outros';
  
  // Relacionamentos
  idoso?: Idoso;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'comum';
  municipio: string;
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
