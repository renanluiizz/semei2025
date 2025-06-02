
import { Users, Calendar, Activity, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DashboardStats } from '@/types/models';

interface StatCardsProps {
  stats?: DashboardStats | null;
  onCheckIn: () => void;
  onGenerateReport: () => void;
}

export function StatCards({ stats, onCheckIn, onGenerateReport }: StatCardsProps) {
  const cards = [
    {
      title: 'Total de Idosos',
      value: stats?.total_idosos || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Cadastrados no sistema',
      trend: '+5% este mês'
    },
    {
      title: 'Presentes Hoje',
      value: Math.floor((stats?.total_idosos || 0) * 0.75),
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Check-ins realizados',
      trend: '+12% que ontem'
    },
    {
      title: 'Atividades do Mês',
      value: stats?.atividades_mes || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Realizadas este mês',
      trend: '8 agendadas'
    },
    {
      title: 'Aniversariantes',
      value: stats?.aniversariantes_mes?.length || 0,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Neste mês',
      trend: '3 esta semana'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index}
            className={`semei-card hover-lift border-l-4 ${card.borderColor} group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${card.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-7 w-7 ${card.color}`} />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">{card.trend}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">{card.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500">{card.description}</p>
            </div>
          </div>
        );
      })}
      
      {/* Quick Actions Card */}
      <div className="semei-card border-l-4 border-indigo-200 lg:col-span-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ações Rápidas</h3>
            <p className="text-sm text-slate-600">Ferramentas do dia a dia</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button 
            onClick={onCheckIn}
            className="semei-btn-primary justify-start"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Chamada de Presença
          </Button>
          <Button 
            onClick={onGenerateReport}
            className="semei-btn-secondary justify-start"
          >
            <Activity className="h-4 w-4 mr-2" />
            Gerar Relatórios
          </Button>
        </div>
      </div>
    </div>
  );
}
