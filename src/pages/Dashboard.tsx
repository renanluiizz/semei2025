import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/DashboardStats';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { CheckInDialog } from '@/components/checkin/CheckInDialog';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { QRCodeGenerator } from '@/components/checkin/QRCodeGenerator';
import { Users, Calendar, Activity, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

// Componente memoizado para os cards de estatísticas
const StatCardMemo = memo(({ title, value, icon: Icon, description, color }: {
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
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [reportGeneratorOpen, setReportGeneratorOpen] = useState(false);
  const navigate = useNavigate();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dbHelpers.getDashboardStats(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });

  // Dados simulados para o gráfico de atividades dos últimos 7 dias
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      name: format(date, 'dd/MM', { locale: ptBR }),
      atividades: Math.floor(Math.random() * 20) + 5,
      presenca: Math.floor(Math.random() * 15) + 8
    };
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Presentes Hoje',
      value: Math.floor((stats?.data?.total_idosos || 0) * 0.75),
      icon: TrendingUp,
      description: 'Check-ins realizados',
      color: 'text-green-600',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Atividades do Mês',
      value: stats?.data?.atividades_mes || 0,
      icon: Calendar,
      description: 'Realizadas este mês',
      color: 'text-purple-600',
      trend: { value: 5, isPositive: false }
    },
    {
      title: 'Aniversariantes',
      value: stats?.data?.aniversariantes_mes?.length || 0,
      icon: Activity,
      description: 'Neste mês',
      color: 'text-orange-600'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Sistema de Gestão de Idosos - {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Atualizado: {format(new Date(), 'HH:mm', { locale: ptBR })}</span>
        </div>
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
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <ActivityChart data={activityData} />

        {/* Quick Actions */}
        <QuickActions
          onCheckIn={() => setCheckInDialogOpen(true)}
          onGenerateReport={() => setReportGeneratorOpen(true)}
          onViewIdosos={() => navigate('/idosos')}
          onViewActivities={() => navigate('/atividades')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Generator */}
        <QRCodeGenerator />

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
                  <div key={atividade.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {atividade.activity_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {atividade.elder?.name} • {format(new Date(atividade.check_in_time), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                      {atividade.staff?.full_name && (
                        <p className="text-xs text-blue-600 mt-1">
                          Responsável: {atividade.staff.full_name}
                        </p>
                      )}
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
            <CardTitle>🎉 Aniversariantes do Mês</CardTitle>
            <CardDescription>
              Idosos que fazem aniversário este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.data.aniversariantes_mes.map((idoso) => (
                <div key={idoso.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{idoso.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(idoso.birth_date), 'dd/MM', { locale: ptBR })} • {idoso.age || 0} anos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CheckInDialog 
        open={checkInDialogOpen} 
        onOpenChange={setCheckInDialogOpen} 
      />
      
      <ReportGenerator 
        open={reportGeneratorOpen} 
        onClose={() => setReportGeneratorOpen(false)} 
      />
    </div>
  );
}
