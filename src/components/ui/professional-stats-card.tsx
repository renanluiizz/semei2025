
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ProfessionalStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'amber' | 'purple';
  className?: string;
}

const iconVariants = {
  blue: 'semei-stat-icon-blue',
  green: 'semei-stat-icon-green',
  amber: 'semei-stat-icon-yellow',
  purple: 'semei-stat-icon-purple'
};

export function ProfessionalStatsCard({
  title,
  value,
  description,
  change,
  icon: Icon,
  variant = 'blue',
  className
}: ProfessionalStatsCardProps) {
  return (
    <div className={cn('semei-card-stat animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={cn('semei-stat-icon', iconVariants[variant])}>
            <Icon className="h-7 w-7" />
          </div>
          
          <div className="space-y-2">
            <p className="semei-stat-label">{title}</p>
            <div className="semei-stat-number">{value}</div>
            
            {description && (
              <p className="semei-stat-description">{description}</p>
            )}
            
            {change && (
              <div className={cn(
                'semei-stat-trend flex items-center gap-1',
                change.type === 'increase' ? 'semei-stat-trend-positive' : 'semei-stat-trend-negative'
              )}>
                <span className="text-lg">
                  {change.type === 'increase' ? '↗' : '↘'}
                </span>
                <span>
                  {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                </span>
                {change.period && (
                  <span className="text-slate-500 font-normal">
                    vs {change.period}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
