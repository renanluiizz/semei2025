
import { SemeiLayout } from '@/components/layout/SemeiLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Activity } from 'lucide-react';

export function Dashboard() {
  return (
    <SemeiLayout>
      <div className="space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards - Grid com 4 colunas */}
        <StatCards />

        {/* Content Grid */}
        <div className="semei-grid-content">
          {/* Quick Actions - Ocupa 2 colunas */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          
          {/* Recent Activities - 1 coluna */}
          <div>
            <div className="semei-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="semei-stat-icon semei-stat-icon-green">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Últimas Atividades</h3>
                  <p className="text-sm text-gray-600 font-medium">Ações recentes no sistema</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="semei-activity-item">
                  <div className="semei-activity-status semei-activity-status-active"></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Sistema iniciado</p>
                    <p className="text-xs text-gray-500">há 2 minutos</p>
                  </div>
                </div>
                
                <div className="semei-activity-item">
                  <div className="semei-activity-status semei-activity-status-completed"></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Backup realizado</p>
                    <p className="text-xs text-gray-500">há 1 hora</p>
                  </div>
                </div>
                
                <div className="semei-activity-item">
                  <div className="semei-activity-status semei-activity-status-active"></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Novo idoso cadastrado</p>
                    <p className="text-xs text-gray-500">há 3 horas</p>
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
