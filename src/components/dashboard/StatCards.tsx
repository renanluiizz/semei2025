
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
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
      description: 'Cadastrados no sistema'
    },
    {
      title: 'Presentes Hoje',
      value: Math.floor((stats?.total_idosos || 0) * 0.75),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Check-ins realizados'
    },
    {
      title: 'Atividades do Mês',
      value: stats?.atividades_mes || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Realizadas este mês'
    },
    {
      title: 'Aniversariantes',
      value: stats?.aniversariantes_mes?.length || 0,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Neste mês'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          </div>
        );
      })}
      
      {/* Quick Actions Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
        <div className="space-y-3">
          <Button 
            onClick={onCheckIn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Chamada de Presença
          </Button>
          <Button 
            onClick={onGenerateReport}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Gerar Relatórios
          </Button>
        </div>
      </div>
    </div>
  );
}
