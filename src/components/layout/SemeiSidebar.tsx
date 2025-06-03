
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SemeiSidebarProps {
  onClose?: () => void;
}

export function SemeiSidebar({ onClose }: SemeiSidebarProps) {
  const { userProfile } = useAuth();
  const location = useLocation();

  const menuSections = [
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
    ...(userProfile?.role === 'admin' ? [{
      title: "ADMINISTRAÇÃO",
      items: [
        { icon: UserCog, label: 'Servidores', path: '/servidores' },
        { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar' },
        { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar' },
        { icon: Shield, label: 'Logs de Auditoria', path: '/auditoria' },
        { icon: Settings, label: 'Configurações', path: '/configuracoes' }
      ]
    }] : [])
  ];

  return (
    <>
      {/* Header */}
      <div className="semei-sidebar-header relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg border border-white/30">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">SEMEI</h1>
              <p className="text-xs text-blue-100 font-medium">Sistema de Monitoramento</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/10 w-8 h-8 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar no sistema..."
            className="semei-input semei-search w-full pl-10 text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="semei-sidebar-content">
        {menuSections.map((section) => (
          <div key={section.title} className="semei-sidebar-section">
            <h3 className="semei-sidebar-title">
              <div className="w-3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/idosos' && location.pathname.startsWith('/idosos'));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`group semei-sidebar-item ${
                      isActive ? 'semei-sidebar-item-active' : 'semei-sidebar-item-inactive'
                    }`}
                  >
                    <Icon 
                      size={20} 
                      className={`transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                      }`} 
                    />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-l-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Info */}
      <div className="p-6 border-t border-slate-200/60 bg-slate-50/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/60">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {userProfile?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {userProfile?.full_name || 'Usuário'}
            </p>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
