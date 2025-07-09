
import { Calendar, Clock, TrendingUp, Users, Activity, Gift, Award, Target, AlertCircle, UserCheck, FileText, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { dashboardHelpers } from '@/lib/dashboard';
import { LoadingCard } from '@/components/ui/loading-card';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export function ModernDashboard() {
  const { userProfile } = useAuth();
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const result = await dashboardHelpers.getDashboardStats();
      if (result.error) {
        console.error('Dashboard error:', result.error);
        return result.data;
      }
      return result.data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingCard />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  const stats = [
    {
      title: 'Total de Idosos',
      value: dashboardData?.totalElders?.toString() || '0',
      description: 'Cadastrados no sistema',
      change: { value: 5, type: 'increase' as const, period: 'este mês' },
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/idosos'
    },
    {
      title: 'Presentes Hoje',
      value: dashboardData?.activeToday?.toString() || '0',
      description: 'Participando de atividades',
      change: { value: 12, type: 'increase' as const, period: 'que ontem' },
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/atividades'
    },
    {
      title: 'Atividades Disponíveis',
      value: dashboardData?.totalActivityTypes?.toString() || '5',
      description: 'Tipos de atividades',
      change: { value: 3, type: 'increase' as const, period: 'vs anterior' },
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/tipos-atividade'
    },
    {
      title: 'Check-ins Realizados',
      value: dashboardData?.totalCheckIns?.toString() || '0',
      description: 'Registros de presença',
      change: { value: 8, type: 'increase' as const, period: 'esta semana' },
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/atividades'
    }
  ];

  const quickActions = [
    { 
      icon: Activity, 
      label: 'Chamada de Presença', 
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/atividades'
    },
    { 
      icon: Users, 
      label: 'Novo Cadastro', 
      color: 'bg-green-600 hover:bg-green-700',
      href: '/idosos/novo'
    },
    { 
      icon: Calendar, 
      label: 'Agendar Atividade', 
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/tipos-atividade'
    },
    { 
      icon: FileText, 
      label: 'Gerar Relatórios', 
      color: 'bg-orange-600 hover:bg-orange-700',
      href: '/relatorios'
    },
    { 
      icon: BarChart3, 
      label: 'Ver Estatísticas', 
      color: 'bg-indigo-600 hover:bg-indigo-700',
      href: '/dashboard'
    },
    { 
      icon: Clock, 
      label: 'Histórico', 
      color: 'bg-gray-600 hover:bg-gray-700',
      href: '/atividades'
    }
  ];

  const recentActivities = dashboardData?.recentCheckIns?.slice(0, 8) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header com informações da data */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard SEMEI</h1>
                <p className="text-gray-600 font-medium">
                  {userProfile?.role === 'admin' ? 'Painel Administrativo' : 'Painel do Servidor'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium capitalize">{currentDate}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Sistema Online</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Atualizado: agora</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.href}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 group block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-105 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {stat.title}
              </p>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
              
              <div className={`flex items-center gap-1 text-xs font-medium ${
                stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="text-sm">
                  {stat.change.type === 'increase' ? '↗' : '↘'}
                </span>
                <span>
                  {stat.change.type === 'increase' ? '+' : '-'}{Math.abs(stat.change.value)}%
                </span>
                <span className="text-gray-500 font-normal">
                  vs {stat.change.period}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Seção de Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ações Rápidas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Ações Rápidas</h3>
                <p className="text-sm text-gray-600 font-medium">Ferramentas do dia a dia</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className={`${action.color} text-white p-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center gap-3`}
                >
                  <action.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Atividades Recentes */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-50 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Atividades Recentes</h3>
                <p className="text-sm text-gray-600 font-medium">Últimas movimentações</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.elders?.name || 'Atividade'} - {activity.activity_type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(activity.check_in_time), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma atividade recente</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link 
                to="/atividades"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Ver Todas as Atividades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
