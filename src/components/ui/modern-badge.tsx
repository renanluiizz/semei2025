
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernBadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses = {
  success: 'semei-badge-success',
  warning: 'semei-badge-warning',
  danger: 'semei-badge-danger',
  info: 'semei-badge-info',
  neutral: 'semei-badge-neutral'
};

const dotClasses = {
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-slate-500'
};

export function ModernBadge({ variant = 'neutral', children, className, dot = false }: ModernBadgeProps) {
  return (
    <span className={cn('semei-badge', variantClasses[variant], className)}>
      {dot && <div className={cn('w-1.5 h-1.5 rounded-full', dotClasses[variant])} />}
      {children}
    </span>
  );
}
