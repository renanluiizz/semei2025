
import { useState, useCallback } from 'react';
import { securityHelpers } from '@/lib/security';

interface ValidationRule {
  field: string;
  validator: (value: any) => { isValid: boolean; error?: string };
}

export function useSecureFormValidation(rules: ValidationRule[]) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: string, value: any): boolean => {
    const rule = rules.find(r => r.field === field);
    if (!rule) return true;

    const result = rule.validator(value);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (result.isValid) {
        delete newErrors[field];
      } else {
        newErrors[field] = result.error || 'Valor inválido';
      }
      return newErrors;
    });

    return result.isValid;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    for (const rule of rules) {
      const result = rule.validator(formData[rule.field]);
      if (!result.isValid) {
        newErrors[rule.field] = result.error || 'Valor inválido';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [rules]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0
  };
}
