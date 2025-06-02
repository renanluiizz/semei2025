
import { Clock, User, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Atividade } from '@/types/models';

interface RecentActivitiesTableProps {
  activities: Atividade[];
}

export function RecentActivitiesTable({ activities }: RecentActivitiesTableProps) {
  return (
    <div className="semei-card">
      <div className="semei-card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Atividades Recentes</h2>
            <p className="text-slate-600 text-sm mt-1">Últimas atividades registradas no sistema</p>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Tempo real</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="semei-table">
          <thead className="semei-table-header">
            <tr>
              <th className="semei-table-header th">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Atividade
                </div>
              </th>
              <th className="semei-table-header th">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Participante
                </div>
              </th>
              <th className="semei-table-header th">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Responsável
                </div>
              </th>
              <th className="semei-table-header th">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Data/Hora
                </div>
              </th>
              <th className="semei-table-header th">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity.id} className="semei-table-row hover:bg-slate-50/50">
                  <td className="semei-table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-semibold text-slate-900">
                        {activity.activity_type}
                      </span>
                    </div>
                  </td>
                  <td className="semei-table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                        {activity.elder?.name?.charAt(0) || 'N'}
                      </div>
                      <span className="font-medium text-slate-900">
                        {activity.elder?.name || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="semei-table-cell">
                    <span className="font-medium text-slate-700">
                      {activity.staff?.full_name || 'N/A'}
                    </span>
                  </td>
                  <td className="semei-table-cell">
                    <div className="text-slate-600">
                      <div className="font-medium">
                        {format(new Date(activity.check_in_time), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(activity.check_in_time), 'HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  </td>
                  <td className="semei-table-cell">
                    <span className="semei-badge semei-badge-success">
                      Concluída
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 px-6 text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">Nenhuma atividade recente</h3>
                    <p className="text-slate-500">As atividades aparecerão aqui conforme são registradas</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
