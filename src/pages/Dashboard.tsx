
import { SemeiLayout } from '@/components/layout/SemeiLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickActions } from '@/components/dashboard/QuickActions';

export function Dashboard() {
  return (
    <SemeiLayout>
      <div className="space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <StatCards />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          
          {/* Additional content can go here */}
          <div className="space-y-6">
            <div className="semei-card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Últimas Atividades</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Sistema iniciado</p>
                    <p className="text-xs text-slate-500">Há 2 minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SemeiLayout>
  );
}
