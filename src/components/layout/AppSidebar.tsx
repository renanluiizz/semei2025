
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  Calendar,
  Settings,
  UserPlus,
  Activity,
  FileSpreadsheet,
  RotateCcw,
  Shield,
  UserCog,
  X,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  adminOnly?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export function AppSidebar({ isOpen, onClose, onOpenSearch }: AppSidebarProps) {
  const { userProfile } = useAuth();
  const location = useLocation();

  const menuSections: MenuSection[] = [
    {
      title: "PRINCIPAL",
      items: [
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Idosos', path: '/idosos' },
        { icon: UserPlus, label: 'Novo Cadastro', path: '/idosos/novo' },
      ]
    },
    {
      title: "ATIVIDADES", 
      items: [
        { icon: Calendar, label: 'Atividades', path: '/atividades' },
        { icon: Activity, label: 'Tipos de Atividade', path: '/tipos-atividade' },
      ]
    },
    {
      title: "ADMINISTRAÇÃO",
      items: [
        { icon: UserCog, label: 'Servidores', path: '/servidores', adminOnly: true },
        { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar', adminOnly: true },
        { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar', adminOnly: true },
        { icon: Shield, label: 'Logs de Auditoria', path: '/auditoria', adminOnly: true },
        { icon: Settings, label: 'Configurações', path: '/configuracoes', adminOnly: true }
      ]
    }
  ];

  const isAdmin = userProfile?.role === 'admin';
  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || isAdmin)
  })).filter(section => section.items.length > 0);

  const isActiveRoute = (path: string) => {
    return location.pathname === path || 
      (path === '/idosos' && location.pathname.startsWith('/idosos'));
  };

  return (
    <div className={cn(
      "fixed lg:static inset-y-0 left-0 z-50 semei-sidebar transform transition-all duration-300 ease-in-out flex flex-col",
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    )}>
      {/* Modern Sidebar Header */}
      <div className="semei-sidebar-header relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg border border-white/30">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">SEMEI</h1>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-200" />
                <p className="text-xs text-blue-100 font-medium">Sistema Profissional</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/10 w-8 h-8 rounded-xl"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modern Search Button */}
      <div className="p-4 border-b border-slate-200/60">
        <Button
          variant="outline"
          className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-left h-12 transition-all duration-200 focus-ring"
          onClick={onOpenSearch}
        >
          <Search className="h-4 w-4 mr-3 text-slate-400" />
          <span className="text-slate-500 font-medium">Buscar no sistema...</span>
        </Button>
      </div>

      {/* Modern Navigation */}
      <nav className="semei-sidebar-content">
        {filteredSections.map((section, sectionIndex) => (
          <div key={section.title} className="semei-sidebar-group">
            <h3 className="semei-sidebar-group-label">
              <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "group semei-sidebar-item animate-slide-in-left",
                      isActive ? 'semei-sidebar-item-active' : 'semei-sidebar-item-inactive'
                    )}
                    style={{ 
                      animationDelay: `${(sectionIndex * 100) + (itemIndex * 50)}ms` 
                    }}
                  >
                    <Icon size={20} className={cn(
                      "transition-all duration-200",
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                    )} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/80 rounded-l-full shadow-lg"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Modern Footer */}
      <div className="p-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-xs text-slate-500 font-medium mb-1">Sistema v3.0</p>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-400">
            <Sparkles className="h-3 w-3" />
            <span>Powered by SEMEI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
