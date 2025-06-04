
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivities } from '@/components/dashboard/RecentActivities';

export function Dashboard() {
  return (
    <div className="semei-dashboard">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Cards */}
      <StatCards />

      {/* Content Grid */}
      <div className="semei-grid-content">
        {/* Quick Actions - Ocupa 2 colunas */}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        
        {/* Recent Activities - 1 coluna */}
        <div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}
