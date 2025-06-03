
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';

interface StatCard {
  icon: React.ElementType;
  iconBg: string;
  value: string;
  label: string;
  description: string;
  trend: string;
  trendColor: string;
}

export function StatCards() {
  const stats: StatCard[] = [
    {
      icon: Users,
      iconBg: 'semei-stat-icon-blue',
      value: '1',
      label: 'Total de Idosos',
      description: 'Cadastrados no sistema',
      trend: '+5% este mês',
      trendColor: 'semei-stat-trend-positive'
    },
    {
      icon: Activity,
      iconBg: 'semei-stat-icon-green', 
      value: '0',
      label: 'Presentes Hoje',
      description: 'Check-ins realizados',
      trend: '+12% que ontem',
      trendColor: 'semei-stat-trend-positive'
    },
    {
      icon: Calendar,
      iconBg: 'semei-stat-icon-purple',
      value: '0',
      label: 'Atividades do Mês',
      description: 'Realizadas este mês',
      trend: '8 agendadas',
      trendColor: 'semei-stat-trend-neutral'
    },
    {
      icon: TrendingUp,
      iconBg: 'semei-stat-icon-orange',
      value: '0',
      label: 'Aniversariantes',
      description: 'Neste mês',
      trend: '3 esta semana',
      trendColor: 'semei-stat-trend-neutral'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="semei-card-stat">
            <div className={`semei-stat-icon ${stat.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="semei-stat-number">{stat.value}</div>
              <div className="semei-stat-label">{stat.label}</div>
              <div className="semei-stat-description">{stat.description}</div>
              <div className={`semei-stat-trend ${stat.trendColor}`}>
                {stat.trend}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
