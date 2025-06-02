
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbHelpers } from '@/lib/supabase';
import { SemeiLayout } from '@/components/layout/SemeiLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { RecentActivitiesTable } from '@/components/dashboard/RecentActivitiesTable';
import { AttendanceDialog } from '@/components/checkin/AttendanceDialog';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-md">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>
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
    return (
      <SemeiLayout>
        <div className="space-y-6">
          <DashboardHeader />
          <DashboardSkeleton />
        </div>
      </SemeiLayout>
    );
  }

  if (error) {
    return (
      <SemeiLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center bg-white rounded-2xl p-8 shadow-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro ao carregar dados</h3>
            <p className="text-gray-600 mb-4">Não foi possível carregar as informações do dashboard</p>
            <Button onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </SemeiLayout>
    );
  }

  return (
    <SemeiLayout>
      <div className="space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Cards de Indicadores */}
        <StatCards 
          stats={stats?.data}
          onCheckIn={() => setAttendanceDialogOpen(true)}
          onGenerateReport={() => setReportGeneratorOpen(true)}
        />

        {/* Gráficos */}
        <ChartsSection />

        {/* Tabela de Atividades Recentes */}
        <RecentActivitiesTable activities={stats?.data?.atividades_recentes || []} />

        {/* Modais */}
        <AttendanceDialog 
          open={attendanceDialogOpen} 
          onOpenChange={setAttendanceDialogOpen} 
        />
        
        {reportGeneratorOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto shadow-2xl">
              <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-800">Gerador de Relatórios</h2>
                <Button
                  variant="ghost"
                  onClick={() => setReportGeneratorOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <ReportGenerator />
              </div>
            </div>
          </div>
        )}
      </div>
    </SemeiLayout>
  );
}
