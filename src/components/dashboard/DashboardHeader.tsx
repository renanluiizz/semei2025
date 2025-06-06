
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardHeader() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="semei-page-header">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="semei-page-title">Dashboard Executivo</h1>
          <div className="semei-page-subtitle">
            <Calendar className="h-4 w-4 text-blue-600" />
            <p className="capitalize">{currentDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="semei-badge semei-badge-success">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Sistema Online
          </div>
        </div>
      </div>
    </div>
  );
}
