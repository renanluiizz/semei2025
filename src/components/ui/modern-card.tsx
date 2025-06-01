
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

interface ModernCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernCardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModernCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCard({ children, className, hoverable = false }: ModernCardProps) {
  return (
    <div className={cn(
      'semei-card animate-fade-in',
      hoverable && 'hover-lift cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
}

export function ModernCardHeader({ children, className }: ModernCardHeaderProps) {
  return (
    <div className={cn('semei-card-header', className)}>
      {children}
    </div>
  );
}

export function ModernCardContent({ children, className }: ModernCardContentProps) {
  return (
    <div className={cn('semei-card-content', className)}>
      {children}
    </div>
  );
}

export function ModernCardFooter({ children, className }: ModernCardFooterProps) {
  return (
    <div className={cn('semei-card-footer', className)}>
      {children}
    </div>
  );
}
