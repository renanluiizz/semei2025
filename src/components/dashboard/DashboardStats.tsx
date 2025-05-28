
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = memo(({ title, value, icon: Icon, description, color, trend }: StatCardProps) => (
  <Card className="hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: color.replace('text-', '#') }}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-xs text-gray-500 mt-1">
        {description}
      </p>
      {trend && (
        <div className={`text-xs mt-2 flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span>{trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%</span>
          <span className="ml-1 text-gray-500">vs mês anterior</span>
        </div>
      )}
    </CardContent>
  </Card>
));
