
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from './NotificationCenter';
import { UserMenu } from './UserMenu';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export function AppHeader({ onOpenSidebar }: AppHeaderProps) {
  const location = useLocation();

  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/idosos': 'Gestão de Idosos',
      '/atividades': 'Atividades',
      '/tipos-atividade': 'Tipos de Atividade',
      '/servidores': 'Gestão de Servidores',
      '/configuracoes': 'Configurações',
      '/auditoria': 'Logs de Auditoria',
      '/importar': 'Importar Dados',
      '/resetar': 'Resetar Sistema'
    };

    return pathMap[location.pathname] || 'SEMEI';
  };

  return (
    <header className="semei-header sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden rounded-xl w-10 h-10 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div>
          <h1 className="text-xl font-bold text-slate-900">{getPageTitle()}</h1>
          <p className="text-sm text-slate-600 font-medium">
            Sistema de Monitoramento de Estruturas Institucionais
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
}
