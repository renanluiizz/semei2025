
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from './NotificationCenter';
import { UserMenu } from './UserMenu';
import { Menu, Sparkles, Zap } from 'lucide-react';

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export function AppHeader({ onOpenSidebar }: AppHeaderProps) {
  const location = useLocation();

  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard Executivo',
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

  const getPageDescription = () => {
    const descMap: Record<string, string> = {
      '/dashboard': 'Visão geral completa do sistema',
      '/idosos': 'Gerenciamento completo de cadastros',
      '/atividades': 'Coordenação de eventos e atividades',
      '/tipos-atividade': 'Configuração de categorias',
      '/servidores': 'Administração de usuários',
      '/configuracoes': 'Personalização do sistema',
      '/auditoria': 'Monitoramento de segurança',
      '/importar': 'Importação em massa de dados',
      '/resetar': 'Manutenção do sistema'
    };

    return descMap[location.pathname] || 'Sistema de Monitoramento Institucional';
  };

  return (
    <header className="semei-header sticky top-0 z-30 flex items-center justify-between animate-slide-in-top">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          className="lg:hidden rounded-xl w-11 h-11 hover:bg-slate-100 focus-ring"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
            <p className="text-sm text-slate-600 font-medium flex items-center gap-2">
              <Zap className="h-3 w-3 text-blue-500" />
              {getPageDescription()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700">Online</span>
        </div>
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
}
