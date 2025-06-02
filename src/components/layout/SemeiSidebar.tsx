
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
  X
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
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md hover:bg-gray-50"
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
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white py-6 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-8">
          <div>
            <h1 className="text-xl font-bold">SEMEI</h1>
            <p className="text-blue-200 text-sm">Cabo Frio</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-white hover:bg-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
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
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-700 text-white shadow-md' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="px-6 pt-4 border-t border-blue-500">
          <div className="flex items-center gap-3 text-blue-100">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userProfile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-blue-200">
                {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
