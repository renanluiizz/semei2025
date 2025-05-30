
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('pt-BR');
}

export function safeFormatDateTime(dateString: string | null | undefined, fallback: string = 'Data não informada'): string {
  if (!dateString) {
    return fallback;
  }
  
  try {
    // Tentar criar a data diretamente
    let date = new Date(dateString);
    
    // Se não for válida, tentar parseISO
    if (!isValid(date)) {
      date = parseISO(dateString);
    }
    
    // Verificar se a data é válida
    if (!isValid(date)) {
      console.warn('Data inválida encontrada:', dateString);
      return 'Data inválida';
    }
    
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', dateString, error);
    return 'Erro na data';
  }
}

export function safeFormatDate(dateString: string | null | undefined, fallback: string = 'Data não informada'): string {
  if (!dateString) {
    return fallback;
  }
  
  try {
    // Tentar criar a data diretamente
    let date = new Date(dateString);
    
    // Se não for válida, tentar parseISO
    if (!isValid(date)) {
      date = parseISO(dateString);
    }
    
    // Verificar se a data é válida
    if (!isValid(date)) {
      console.warn('Data inválida encontrada:', dateString);
      return 'Data inválida';
    }
    
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', dateString, error);
    return 'Erro na data';
  }
}
