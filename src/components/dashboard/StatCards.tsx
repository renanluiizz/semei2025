
import { Users, Calendar, Activity, Gift } from 'lucide-react';
import { ProfessionalStatsCard } from '@/components/ui/professional-stats-card';

export function StatCards() {
  const stats = [
    {
      title: 'Total de Idosos',
      value: '1.247',
      description: 'Cadastrados no sistema',
      change: {
        value: 5,
        type: 'increase' as const,
        period: 'este mês'
      },
      icon: Users,
      variant: 'blue' as const
    },
    {
      title: 'Presentes Hoje',
      value: '89',
      description: 'Check-ins realizados',
      change: {
        value: 12,
        type: 'increase' as const,
        period: 'que ontem'
      },
      icon: Activity,
      variant: 'green' as const
    },
    {
      title: 'Atividades do Mês',
      value: '24',
      description: 'Realizadas este mês',
      change: {
        value: 3,
        type: 'decrease' as const,
        period: 'vs anterior'
      },
      icon: Calendar,
      variant: 'purple' as const
    },
    {
      title: 'Aniversariantes',
      value: '15',
      description: 'Neste mês',
      change: {
        value: 3,
        type: 'increase' as const,
        period: 'esta semana'
      },
      icon: Gift,
      variant: 'amber' as const
    }
  ];

  return (
    <div className="semei-grid-stats">
      {stats.map((stat, index) => (
        <ProfessionalStatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          change={stat.change}
          icon={stat.icon}
          variant={stat.variant}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
}
