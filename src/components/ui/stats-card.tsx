
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'amber' | 'purple';
  className?: string;
}

const variantClasses = {
  blue: 'semei-stat-card-blue',
  green: 'semei-stat-card-green',
  amber: 'semei-stat-card-amber',
  purple: 'semei-stat-card-purple'
};

const iconBgClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600'
};

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'blue',
  className
}: StatsCardProps) {
  return (
    <div className={cn(variantClasses[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-sm font-medium',
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%</span>
              <span className="text-slate-500">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          iconBgClasses[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
