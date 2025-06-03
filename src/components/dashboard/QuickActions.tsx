
import { TrendingUp, UserCheck, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  return (
    <div className="semei-card">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Ações Rápidas</h3>
          <p className="text-sm text-slate-600 font-medium">Ferramentas do dia a dia</p>
        </div>
      </div>
      
      <div className="semei-quick-actions">
        <Button className="semei-btn semei-btn-purple justify-start">
          <UserCheck className="h-5 w-5" />
          Chamada de Presença
        </Button>
        <Button className="semei-btn semei-btn-secondary justify-start">
          <Activity className="h-5 w-5" />
          Gerar Relatórios
        </Button>
      </div>
    </div>
  );
}
