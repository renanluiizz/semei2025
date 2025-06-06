
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ProfessionalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'purple' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm h-9',
  md: 'px-6 py-3 text-sm h-11',
  lg: 'px-8 py-4 text-base h-12'
};

const variantClasses = {
  primary: 'semei-btn-primary',
  secondary: 'semei-btn-secondary',
  success: 'semei-btn-success',
  danger: 'semei-btn-danger',
  ghost: 'semei-btn-ghost',
  purple: 'semei-btn-purple',
  orange: 'semei-btn-orange'
};

export function ProfessionalButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  fullWidth = false,
  ...props
}: ProfessionalButtonProps) {
  return (
    <button
      className={cn(
        'semei-btn relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 relative z-10">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        <span className="font-semibold">{children}</span>
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </button>
  );
}
