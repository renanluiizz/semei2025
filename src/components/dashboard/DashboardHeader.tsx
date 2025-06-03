
import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardHeader() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="semei-card mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Executivo</h1>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="h-4 w-4" />
            <p className="text-sm font-medium capitalize">{currentDate}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar no sistema..." 
              className="pl-10 w-full sm:w-72 semei-input"
            />
          </div>
          <Button className="semei-btn-secondary flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>
    </div>
  );
}
