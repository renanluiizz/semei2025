
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SemeiSidebar() {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Idosos', path: '/idosos' },
    { icon: UserPlus, label: 'Novo Cadastro', path: '/idosos/novo' },
    { icon: Calendar, label: 'Atividades', path: '/atividades' },
    { icon: Activity, label: 'Tipos de Atividade', path: '/tipos-atividade' },
    ...(userProfile?.role === 'admin' ? [
      { icon: UserCog, label: 'Servidores', path: '/servidores' },
      { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar' },
      { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar' },
      { icon: Shield, label: 'Logs de Auditoria', path: '/auditoria' },
      { icon: Settings, label: 'Configurações', path: '/configuracoes' }
    ] : [])
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-50 rounded-xl"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 shadow-sm flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SEMEI</h1>
              <p className="text-xs text-blue-100">Cabo Frio</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-white hover:bg-white/10 w-8 h-8 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/idosos' && location.pathname.startsWith('/idosos'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <Icon size={20} className={`transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                }`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {userProfile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-slate-500">
                {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
