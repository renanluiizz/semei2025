
import { TrendingUp, UserCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  return (
    <div className="semei-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Ações Rápidas</h3>
          <p className="text-sm text-slate-600">Ferramentas do dia a dia</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button className="semei-btn-primary justify-start">
          <UserCheck className="h-4 w-4 mr-2" />
          Chamada de Presença
        </Button>
        <Button className="semei-btn-secondary justify-start">
          <Activity className="h-4 w-4 mr-2" />
          Gerar Relatórios
        </Button>
      </div>
    </div>
  );
}
