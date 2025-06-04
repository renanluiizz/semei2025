
import { Activity } from 'lucide-react';

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      title: 'Sistema iniciado',
      time: 'há 2 minutos',
      status: 'active'
    },
    {
      id: 2,
      title: 'Backup realizado',
      time: 'há 1 hora',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Novo idoso cadastrado',
      time: 'há 3 horas',
      status: 'active'
    }
  ];

  return (
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
        {activities.map((activity) => (
          <div key={activity.id} className="semei-activity-item">
            <div className={`semei-activity-status ${
              activity.status === 'active' ? 'semei-activity-status-active' : 'semei-activity-status-completed'
            }`}></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
