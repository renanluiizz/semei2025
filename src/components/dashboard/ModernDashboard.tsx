
import { Calendar, Clock, TrendingUp, Users, Activity, Gift, Award, Target, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { dashboardHelpers } from '@/lib/dashboard';
import { LoadingCard } from '@/components/ui/loading-card';

export function ModernDashboard() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Usar React Query com configuração otimizada
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const result = await dashboardHelpers.getDashboardStats();
      if (result.error) {
        console.error('Dashboard error:', result.error);
        // Retornar dados padrão em caso de erro
        return result.data;
      }
      return result.data;
    },
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Atualizar a cada minuto
    retry: 1, // Reduzir tentativas para evitar travamentos
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingCard />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-red-800 font-bold text-xl mb-2">Sistema Temporariamente Indisponível</h3>
                <p className="text-red-700 mb-4">Erro ao carregar dados do dashboard</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Idosos',
      value: dashboardData?.totalElders?.toString() || '0',
      description: 'Cadastrados no sistema',
      change: { value: 5, type: 'increase' as const, period: 'este mês' },
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Presentes Hoje',
      value: dashboardData?.activeToday?.toString() || '0',
      description: 'Participando de atividades',
      change: { value: 12, type: 'increase' as const, period: 'que ontem' },
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Atividades Disponíveis',
      value: dashboardData?.totalActivityTypes?.toString() || '0',
      description: 'Tipos de atividades',
      change: { value: 3, type: 'increase' as const, period: 'vs anterior' },
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Check-ins Realizados',
      value: dashboardData?.totalCheckIns?.toString() || '0',
      description: 'Registros de presença',
      change: { value: 8, type: 'increase' as const, period: 'esta semana' },
      icon: Gift,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  const quickActions = [
    { icon: Activity, label: 'Chamada de Presença', color: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' },
    { icon: Users, label: 'Novo Cadastro', color: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' },
    { icon: Calendar, label: 'Agendar Atividade', color: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' },
    { icon: Award, label: 'Gerar Relatórios', color: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' },
    { icon: TrendingUp, label: 'Ver Estatísticas', color: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700' },
    { icon: Clock, label: 'Histórico', color: 'from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700' }
  ];

  const recentActivities = dashboardData?.recentCheckIns?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header Institucional Melhorado */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg">
                    <Award className="h-9 w-9 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Dashboard Executivo
                    </h1>
                    <p className="text-slate-600 font-medium text-lg">Sistema de Monitoramento Institucional SEMEI</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <p className="text-lg font-medium capitalize">{currentDate}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Sistema Online</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Atualizado: agora</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas Melhorados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 p-6 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${stat.bgColor} transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <div className="text-4xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                  
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span className="text-base">
                      {stat.change.type === 'increase' ? '↗' : '↘'}
                    </span>
                    <span>
                      {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
                    </span>
                    <span className="text-slate-500 font-normal">
                      vs {stat.change.period}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de Conteúdo Melhorada */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ações Rápidas */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
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
                      className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-2xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-3`}
                    >
                      <action.icon className="h-5 w-5" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Atividades Recentes */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-2xl">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Atividades Recentes</h3>
                    <p className="text-sm text-slate-600 font-medium">Últimas movimentações</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div key={activity.id || index} className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {activity.elders?.name || 'Atividade'} - {activity.activity_type}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(activity.check_in_time), 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma atividade recente</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <button className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2">
                    <Activity className="h-4 w-4" />
                    Ver Todas as Atividades
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
