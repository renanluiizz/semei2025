
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbHelpers } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/DashboardStats';
import { EnhancedActivityChart } from '@/components/dashboard/EnhancedActivityChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AttendanceDialog } from '@/components/checkin/AttendanceDialog';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { QRCodeGenerator } from '@/components/checkin/QRCodeGenerator';
import { Users, Calendar, Activity, TrendingUp, Clock, AlertTriangle, Heart, X } from 'lucide-react';
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
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [reportGeneratorOpen, setReportGeneratorOpen] = useState(false);
  const navigate = useNavigate();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dbHelpers.getDashboardStats(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
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
    <div className="space-y-6 p-4 md:p-6">
      {/* Header com melhor responsividade */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard SEMEI
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm md:text-base">
            <Heart className="h-4 w-4 text-primary" />
            Secretaria da Melhor Idade - {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-border/50">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Atualizado:</span>
          <span>{format(new Date(), 'HH:mm', { locale: ptBR })}</span>
        </div>
      </div>

      {/* Cards de estatísticas com melhor responsividade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statisticCards.map((stat) => (
          <Card key={stat.title} className="semei-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
              {stat.trend && (
                <div className={`text-xs mt-2 flex items-center ${stat.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <span>{stat.trend.isPositive ? '↗' : '↘'} {Math.abs(stat.trend.value)}%</span>
                  <span className="ml-1 text-gray-500 hidden sm:inline">vs mês anterior</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Layout responsivo para gráficos e ações rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Enhanced Activity Chart */}
        <EnhancedActivityChart />

        {/* Quick Actions melhoradas */}
        <QuickActions
          onCheckIn={() => setAttendanceDialogOpen(true)}
          onGenerateReport={() => setReportGeneratorOpen(true)}
          onViewIdosos={() => navigate('/idosos')}
          onViewActivities={() => navigate('/atividades')}
        />
      </div>

      {/* Seção de atividades recentes melhorada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="semei-card">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas atividades cadastradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.data?.atividades_recentes?.length ? (
                stats.data.atividades_recentes.map((atividade) => (
                  <div key={atividade.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
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
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Nenhuma atividade recente encontrada
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de aniversariantes melhorada */}
      {stats?.data?.aniversariantes_mes && stats.data.aniversariantes_mes.length > 0 && (
        <Card className="semei-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              🎉 Aniversariantes do Mês
              <span className="text-sm font-normal text-gray-500">({stats.data.aniversariantes_mes.length})</span>
            </CardTitle>
            <CardDescription>
              Idosos que fazem aniversário este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.data.aniversariantes_mes.map((idoso) => (
                <div key={idoso.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-200/50 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <Heart className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{idoso.name}</p>
                    <p className="text-xs md:text-sm text-gray-600">
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
      <AttendanceDialog 
        open={attendanceDialogOpen} 
        onOpenChange={setAttendanceDialogOpen} 
      />
      
      {/* Modal melhorado para relatórios */}
      {reportGeneratorOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold">Gerador de Relatórios</h2>
              <Button
                variant="ghost"
                onClick={() => setReportGeneratorOpen(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ReportGenerator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
