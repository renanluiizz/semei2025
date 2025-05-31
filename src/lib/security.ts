
// Security utilities for input validation and sanitization
export const securityHelpers = {
  // Sanitize string input to prevent XSS
  sanitizeString: (input: string): string => {
    if (!input) return '';
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Validate CPF format (Brazilian tax ID)
  validateCPF: (cpf: string): boolean => {
    if (!cpf) return false;
    
    // Remove non-numeric characters
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Check if has 11 digits
    if (cleanCPF.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  },

  // Validate email format
  validateEmail: (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  },

  // Validate Brazilian phone format
  validatePhone: (phone: string): boolean => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  },

  // Validate birth date
  validateBirthDate: (birthDate: string): { isValid: boolean; error?: string } => {
    if (!birthDate) return { isValid: false, error: 'Data de nascimento é obrigatória' };
    
    const date = new Date(birthDate);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    
    if (date > today) {
      return { isValid: false, error: 'Data de nascimento não pode ser no futuro' };
    }
    
    if (date < minDate) {
      return { isValid: false, error: 'Data de nascimento muito antiga' };
    }
    
    return { isValid: true };
  },

  // Sanitize form data before submission
  sanitizeFormData: (data: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = securityHelpers.sanitizeString(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  },

  // Check if user has required role
  hasRole: (userRole: string | undefined, requiredRole: 'admin' | 'operator'): boolean => {
    if (!userRole) return false;
    if (requiredRole === 'operator') return userRole === 'admin' || userRole === 'operator';
    return userRole === 'admin';
  },

  // Generate secure random string for file names
  generateSecureFileName: (originalName: string): string => {
    const extension = originalName.split('.').pop() || '';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${timestamp}_${random}.${extension}`;
  },

  // Validate file upload
  validateFileUpload: (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Tipo de arquivo não permitido. Use apenas JPEG, PNG, GIF ou WebP.' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'Arquivo muito grande. Tamanho máximo: 5MB.' };
    }
    
    return { isValid: true };
  }
};
