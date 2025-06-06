
import { Calendar, Clock, TrendingUp, Users, Activity, Gift, Award, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ModernDashboard() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const stats = [
    {
      title: 'Total de Idosos',
      value: '1.247',
      description: 'Cadastrados no sistema',
      change: { value: 5, type: 'increase' as const, period: 'este mês' },
      icon: Users,
      variant: 'blue' as const
    },
    {
      title: 'Presentes Hoje',
      value: '89',
      description: 'Check-ins realizados',
      change: { value: 12, type: 'increase' as const, period: 'que ontem' },
      icon: Activity,
      variant: 'green' as const
    },
    {
      title: 'Atividades do Mês',
      value: '24',
      description: 'Realizadas este mês',
      change: { value: 3, type: 'decrease' as const, period: 'vs anterior' },
      icon: Target,
      variant: 'purple' as const
    },
    {
      title: 'Aniversariantes',
      value: '15',
      description: 'Neste mês',
      change: { value: 3, type: 'increase' as const, period: 'esta semana' },
      icon: Gift,
      variant: 'orange' as const
    }
  ];

  const quickActions = [
    { icon: Activity, label: 'Chamada de Presença', variant: 'purple' as const },
    { icon: Users, label: 'Novo Cadastro', variant: 'success' as const },
    { icon: Calendar, label: 'Agendar Atividade', variant: 'primary' as const },
    { icon: Award, label: 'Gerar Relatórios', variant: 'orange' as const },
    { icon: TrendingUp, label: 'Ver Estatísticas', variant: 'secondary' as const },
    { icon: Clock, label: 'Histórico', variant: 'ghost' as const }
  ];

  const recentActivities = [
    { status: 'active', title: 'Maria Silva fez check-in', time: 'há 5 minutos' },
    { status: 'completed', title: 'Aula de Yoga concluída', time: 'há 15 minutos' },
    { status: 'active', title: 'José Santos fez check-in', time: 'há 20 minutos' },
    { status: 'completed', title: 'Workshop de Artesanato finalizado', time: 'há 1 hora' }
  ];

  return (
    <div className="semei-page">
      <div className="semei-container p-6 lg:p-8 space-y-8">
        {/* Modern Header */}
        <div className="semei-page-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="animate-slide-in-left">
              <h1 className="semei-page-title">Dashboard Executivo</h1>
              <div className="semei-page-subtitle">
                <Calendar className="h-5 w-5 text-blue-600" />
                <p className="capitalize">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 animate-slide-in-right">
              <div className="semei-badge semei-badge-success">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Sistema Online
              </div>
              <div className="semei-badge semei-badge-info">
                <Clock className="h-3 w-3" />
                Última atualização: agora
              </div>
            </div>
          </div>
        </div>

        {/* Modern Statistics Grid */}
        <div className="semei-grid-stats">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="semei-card-stat animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`semei-stat-icon semei-stat-icon-${stat.variant}`}>
                    <stat.icon className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="semei-stat-label">{stat.title}</p>
                    <div className="semei-stat-number">{stat.value}</div>
                    
                    {stat.description && (
                      <p className="semei-stat-description">{stat.description}</p>
                    )}
                    
                    {stat.change && (
                      <div className={`semei-stat-trend ${
                        stat.change.type === 'increase' 
                          ? 'semei-stat-trend-positive' 
                          : 'semei-stat-trend-negative'
                      }`}>
                        <span className="text-lg">
                          {stat.change.type === 'increase' ? '↗' : '↘'}
                        </span>
                        <span>
                          {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
                        </span>
                        {stat.change.period && (
                          <span className="text-slate-500 font-normal">
                            vs {stat.change.period}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="semei-card animate-slide-in-bottom">
              <div className="flex items-center gap-4 mb-6">
                <div className="semei-stat-icon semei-stat-icon-purple">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Ações Rápidas</h3>
                  <p className="text-sm text-slate-600 font-medium">Ferramentas do dia a dia</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`semei-btn semei-btn-${action.variant} justify-start h-auto py-4`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="font-semibold">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Activities */}
          <div>
            <div className="semei-card animate-slide-in-right">
              <div className="flex items-center gap-4 mb-6">
                <div className="semei-stat-icon semei-stat-icon-green">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Atividades Recentes</h3>
                  <p className="text-sm text-slate-600 font-medium">Últimas movimentações</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="semei-activity-item"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    <div className={`semei-activity-status semei-activity-status-${activity.status}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button className="semei-btn semei-btn-ghost w-full">
                  <Activity className="h-4 w-4" />
                  Ver Todas as Atividades
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
