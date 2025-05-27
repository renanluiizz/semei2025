
import { useQuery } from '@tanstack/react-query';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

// Componente memoizado para os cards de estatísticas
const StatCard = memo(({ title, value, icon: Icon, description, color }: {
  title: string;
  value: number;
  icon: any;
  description: string;
  color: string;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500 mt-1">
        {description}
      </p>
    </CardContent>
  </Card>
));

// Componente de loading para o dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="animate-pulse">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dbHelpers.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Erro ao carregar dados do dashboard</p>
          <p className="text-gray-500 text-sm">Tente recarregar a página</p>
        </div>
      </div>
    );
  }

  const statisticCards = [
    {
      title: 'Total de Idosos',
      value: stats?.data?.total_idosos || 0,
      icon: Users,
      description: 'Cadastrados no sistema',
      color: 'text-blue-600',
    },
    {
      title: 'Idosos Ativos',
      value: stats?.data?.idosos_ativos || 0,
      icon: TrendingUp,
      description: 'Atualmente ativos',
      color: 'text-green-600',
    },
    {
      title: 'Atividades do Mês',
      value: stats?.data?.atividades_mes || 0,
      icon: Calendar,
      description: 'Realizadas este mês',
      color: 'text-purple-600',
    },
    {
      title: 'Aniversariantes',
      value: stats?.data?.aniversariantes_mes?.length || 0,
      icon: Activity,
      description: 'Neste mês',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Visão geral do sistema de gestão de idosos
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statisticCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Faixa Etária</CardTitle>
            <CardDescription>
              Quantidade de idosos por idade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.data?.distribuicao_idade || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.data?.atividades_recentes?.length ? (
                stats.data.atividades_recentes.map((atividade) => (
                  <div key={atividade.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {atividade.activity_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {atividade.elder?.name} • {format(new Date(atividade.check_in_time), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Staff ID: {atividade.staff_id}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhuma atividade recente encontrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Birthday Section */}
      {stats?.data?.aniversariantes_mes && stats.data.aniversariantes_mes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Aniversariantes do Mês</CardTitle>
            <CardDescription>
              Idosos que fazem aniversário este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.data.aniversariantes_mes.map((idoso) => (
                <div key={idoso.id} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{idoso.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(idoso.birth_date), 'dd/MM', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
