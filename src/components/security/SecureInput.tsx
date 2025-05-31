
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { securityHelpers } from '@/lib/security';
import { cn } from '@/lib/utils';

interface SecureInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'cpf';
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  validateOnBlur?: boolean;
}

export function SecureInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  className,
  disabled = false,
  validateOnBlur = true
}: SecureInputProps) {
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const validate = (inputValue: string) => {
    if (required && !inputValue.trim()) {
      setError(`${label} é obrigatório`);
      return false;
    }

    switch (type) {
      case 'email':
        if (inputValue && !securityHelpers.validateEmail(inputValue)) {
          setError('Email inválido');
          return false;
        }
        break;
      case 'tel':
        if (inputValue && !securityHelpers.validatePhone(inputValue)) {
          setError('Telefone inválido');
          return false;
        }
        break;
      case 'cpf':
        if (inputValue && !securityHelpers.validateCPF(inputValue)) {
          setError('CPF inválido');
          return false;
        }
        break;
    }

    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = securityHelpers.sanitizeString(e.target.value);
    onChange(sanitizedValue);
    
    // Clear error when user starts typing
    if (error && touched) {
      setError('');
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      validate(value);
    }
  };

  useEffect(() => {
    if (touched && validateOnBlur) {
      validate(value);
    }
  }, [value, touched, validateOnBlur]);

  return (
    <div className="space-y-2">
      <Label htmlFor={label} className={cn(required && "after:content-['*'] after:text-red-500 after:ml-1")}>
        {label}
      </Label>
      <Input
        id={label}
        type={type === 'cpf' ? 'text' : type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          className,
          error && "border-red-500 focus:ring-red-500"
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
