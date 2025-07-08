
import { useEffect, useState } from 'react';
import { Calendar, Clock, TrendingUp, Users, Activity, Gift, Award, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { dashboardHelpers } from '@/lib/dashboard';
import { LoadingCard } from '@/components/ui/loading-card';

export function ModernDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data, error } = await dashboardHelpers.getDashboardStats();
        
        if (error) {
          console.error('Error fetching dashboard data:', error);
          setError('Erro ao carregar dados do dashboard');
        } else {
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Erro inesperado ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <LoadingCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-red-800 font-semibold text-lg mb-2">⚠️ {error}</h3>
            <p className="text-red-600">Tente recarregar a página ou contate o suporte técnico.</p>
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
      title: 'Idosos Ativos',
      value: dashboardData?.activeToday?.toString() || '0',
      description: 'Participando de atividades',
      change: { value: 12, type: 'increase' as const, period: 'que ontem' },
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Atividades do Mês',
      value: dashboardData?.totalActivityTypes?.toString() || '0',
      description: 'Realizadas este mês',
      change: { value: 3, type: 'decrease' as const, period: 'vs anterior' },
      icon: Target,
      color: 'purple'
    },
    {
      title: 'Aniversariantes',
      value: '15',
      description: 'Neste mês',
      change: { value: 3, type: 'increase' as const, period: 'esta semana' },
      icon: Gift,
      color: 'orange'
    }
  ];

  const quickActions = [
    { icon: Activity, label: 'Chamada de Presença', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: Users, label: 'Novo Cadastro', color: 'bg-green-500 hover:bg-green-600' },
    { icon: Calendar, label: 'Agendar Atividade', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Award, label: 'Gerar Relatórios', color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: TrendingUp, label: 'Ver Estatísticas', color: 'bg-slate-500 hover:bg-slate-600' },
    { icon: Clock, label: 'Histórico', color: 'bg-gray-500 hover:bg-gray-600' }
  ];

  const recentActivities = dashboardData?.recentCheckIns?.slice(0, 5) || [
    { id: 1, title: 'Sistema iniciado com sucesso', time: 'há 1 minuto', status: 'active' },
    { id: 2, title: 'Aguardando dados...', time: 'há 2 minutos', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header Profissional */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Executivo
              </h1>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="h-5 w-5 text-blue-600" />
                <p className="text-lg font-medium capitalize">{currentDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">Sistema Online</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
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
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-orange-100 text-orange-600'
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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
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
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Atividades Recentes</h3>
                  <p className="text-sm text-slate-600 font-medium">Últimas movimentações</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
                    } animate-pulse`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
