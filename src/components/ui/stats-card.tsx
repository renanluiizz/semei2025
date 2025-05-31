
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description,
  className = "" 
}: StatsCardProps) {
  return (
    <Card className={`semei-card hover-lift ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{value}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                <span className="ml-1 text-gray-500">vs. mês anterior</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
