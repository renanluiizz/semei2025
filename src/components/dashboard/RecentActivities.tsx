
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ModernBadge } from '@/components/ui/modern-badge';

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      title: 'Sistema Iniciado com Sucesso',
      description: 'Todas as funcionalidades estão operacionais',
      time: 'há 2 minutos',
      status: 'active',
      type: 'system'
    },
    {
      id: 2,
      title: 'Backup Automático Realizado',
      description: 'Dados sincronizados com segurança',
      time: 'há 1 hora',
      status: 'completed',
      type: 'backup'
    },
    {
      id: 3,
      title: 'Novo Idoso Cadastrado',
      description: 'Maria Silva foi adicionada ao sistema',
      time: 'há 3 horas',
      status: 'active',
      type: 'user'
    },
    {
      id: 4,
      title: 'Relatório Mensal Gerado',
      description: 'Relatório de atividades de dezembro',
      time: 'há 5 horas',
      status: 'completed',
      type: 'report'
    },
    {
      id: 5,
      title: 'Manutenção Programada',
      description: 'Sistema será atualizado amanhã às 02:00',
      time: 'amanhã',
      status: 'pending',
      type: 'maintenance'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <ModernBadge variant="success" dot>Ativo</ModernBadge>;
      case 'completed':
        return <ModernBadge variant="info" dot>Concluído</ModernBadge>;
      case 'pending':
        return <ModernBadge variant="warning" dot>Pendente</ModernBadge>;
      default:
        return <ModernBadge variant="neutral" dot>Indefinido</ModernBadge>;
    }
  };

  return (
    <div className="semei-card animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <div className="semei-stat-icon semei-stat-icon-green">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Atividades Recentes</h3>
          <p className="text-sm text-slate-600 font-medium">Últimas ações do sistema</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="group relative">
            <div className="semei-activity-item p-4 hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(activity.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hover Border Effect */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200/50 transition-colors duration-200 pointer-events-none" />
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200/60">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
          Ver todas as atividades
        </button>
      </div>
    </div>
  );
}
