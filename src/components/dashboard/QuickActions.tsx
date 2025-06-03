
import { UserCheck, FileSpreadsheet, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuickActions() {
  return (
    <div className="semei-card">
      <div className="flex items-center gap-4 mb-6">
        <div className="semei-stat-icon semei-stat-icon-purple">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Ações Rápidas</h3>
          <p className="text-sm text-gray-600 font-medium">Ferramentas do dia a dia</p>
        </div>
      </div>
      
      <div className="semei-quick-actions">
        <Button className="semei-btn semei-btn-purple justify-start h-12">
          <UserCheck className="h-5 w-5" />
          📋 Chamada de Presença
        </Button>
        <Button className="semei-btn semei-btn-yellow justify-start h-12">
          <FileSpreadsheet className="h-5 w-5" />
          📊 Gerar Relatórios
        </Button>
      </div>
    </div>
  );
}
