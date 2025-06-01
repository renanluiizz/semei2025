
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

interface ModernTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

interface ModernSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}

export function ModernInput({ label, error, helper, className, ...props }: ModernInputProps) {
  return (
    <div className="semei-form-group">
      {label && <label className="semei-label">{label}</label>}
      <input
        className={cn(
          'semei-input',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helper && !error && <p className="text-sm text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}

export function ModernTextarea({ label, error, helper, className, ...props }: ModernTextareaProps) {
  return (
    <div className="semei-form-group">
      {label && <label className="semei-label">{label}</label>}
      <textarea
        className={cn(
          'semei-textarea',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helper && !error && <p className="text-sm text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}

export function ModernSelect({ label, error, helper, children, className, ...props }: ModernSelectProps) {
  return (
    <div className="semei-form-group">
      {label && <label className="semei-label">{label}</label>}
      <select
        className={cn(
          'semei-select',
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helper && !error && <p className="text-sm text-slate-500 mt-1">{helper}</p>}
    </div>
  );
}
