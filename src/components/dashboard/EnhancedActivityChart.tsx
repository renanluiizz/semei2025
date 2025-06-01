
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardHelpers } from '@/lib/dashboard';
import { LoadingCard } from '@/components/ui/loading-card';

export function EnhancedActivityChart() {
  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ['activity-chart-data'],
    queryFn: () => dashboardHelpers.getActivityChartData(),
    refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
  });

  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-2 semei-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            Atividades vs Presença (Últimos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingCard title={false} lines={8} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 lg:col-span-2 semei-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            Atividades vs Presença (Últimos 7 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Erro ao carregar dados do gráfico</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-xl shadow-lg">
          <p className="font-medium text-gray-900">{`Dia: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey === 'atividades' ? 'Atividades' : 'Presença'}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-2 semei-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-600" />
          <span className="hidden sm:inline">Atividades vs Presença</span>
          <span className="sm:hidden">Atividades</span>
          <span className="text-sm font-normal text-gray-500">(7 dias)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 sm:h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData?.data || []}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="atividadesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="presencaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                iconType="rect"
              />
              <Bar 
                dataKey="atividades" 
                fill="url(#atividadesGradient)"
                name="Atividades"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
              <Bar 
                dataKey="presenca" 
                fill="url(#presencaGradient)"
                name="Presença"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
