
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { ChartsSection } from '@/components/dashboard/ChartsSection';

export function Dashboard() {
  return (
    <div className="semei-page">
      <div className="semei-container p-6 lg:p-8 space-y-8">
        {/* Page Header */}
        <DashboardHeader />

        {/* Statistics Cards */}
        <StatCards />

        {/* Charts Section */}
        <ChartsSection />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          
          {/* Recent Activities - 1 column */}
          <div>
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
}
