
import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardHeader() {
  const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="semei-card mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="semei-page-header">
          <h1 className="semei-page-title">Dashboard Executivo</h1>
          <div className="semei-page-subtitle">
            <Calendar className="h-4 w-4 text-blue-600" />
            <p className="capitalize">{currentDate}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar no sistema..." 
              className="semei-input semei-search pl-12 w-full sm:w-80"
            />
          </div>
          <Button className="semei-btn semei-btn-secondary flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </Button>
        </div>
      </div>
    </div>
  );
}
