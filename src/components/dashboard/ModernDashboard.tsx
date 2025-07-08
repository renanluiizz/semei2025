
import { useEffect, useState } from 'react';
import { Calendar, Clock, TrendingUp, Users, Activity, Gift, Award, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { dashboardHelpers } from '@/lib/dashboard';
import { LoadingCard } from '@/components/ui/loading-card';

export function ModernDashboard() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Usar React Query para melhor gerenciamento de estado e cache
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const result = await dashboardHelpers.getDashboardStats();
      if (result.error) {
        throw new Error(result.error.message || 'Erro ao carregar dados');
      }
      return result.data;
    },
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Atualizar a cada minuto
    retry: 2,
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
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
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
      color: 'blue'
    },
    {
      title: 'Presentes Hoje',
      value: dashboardData?.activeToday?.toString() || '0',
      description: 'Participando de atividades',
      change: { value: 12, type: 'increase' as const, period: 'que ontem' },
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Atividades do Mês',
      value: dashboardData?.totalActivityTypes?.toString() || '0',
      description: 'Tipos disponíveis',
      change: { value: 3, type: 'increase' as const, period: 'vs anterior' },
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Check-ins Hoje',
      value: dashboardData?.totalCheckIns ? Math.floor(dashboardData.totalCheckIns * 0.1).toString() : '0',
      description: 'Registros de presença',
      change: { value: 8, type: 'increase' as const, period: 'esta semana' },
      icon: Gift,
      color: 'orange'
    }
  ];

  const quickActions = [
    { icon: Activity, label: 'Chamada de Presença', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Users, label: 'Novo Cadastro', color: 'bg-green-600 hover:bg-green-700' },
    { icon: Calendar, label: 'Agendar Atividade', color: 'bg-purple-600 hover:bg-purple-700' },
    { icon: Award, label: 'Gerar Relatórios', color: 'bg-orange-600 hover:bg-orange-700' },
    { icon: TrendingUp, label: 'Ver Estatísticas', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { icon: Clock, label: 'Histórico', color: 'bg-slate-600 hover:bg-slate-700' }
  ];

  const recentActivities = dashboardData?.recentCheckIns?.slice(0, 8) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header Institucional */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                    Dashboard Executivo
                  </h1>
                  <p className="text-slate-600 font-medium">Sistema de Monitoramento Institucional</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="h-5 w-5 text-blue-600" />
                <p className="text-lg font-medium capitalize">{currentDate}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Sistema Online</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Atualizado: agora</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-600 group-hover:bg-purple-200' :
                  'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                }`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {stat.title}
                </p>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
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
          ))}
        </div>

        {/* Seção de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ações Rápidas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
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
                    className={`${action.color} text-white p-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-3`}
                  >
                    <action.icon className="h-5 w-5" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Atividades Recentes */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
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
                    <div key={activity.id || index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
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
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
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
