
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
  Home,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SemeiSidebar() {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard', category: 'Principal' },
    { icon: Users, label: 'Idosos', path: '/idosos', category: 'Principal' },
    { icon: UserPlus, label: 'Novo Cadastro', path: '/idosos/novo', category: 'Principal' },
    { icon: Calendar, label: 'Atividades', path: '/atividades', category: 'Atividades' },
    { icon: Activity, label: 'Tipos de Atividade', path: '/tipos-atividade', category: 'Atividades' },
    ...(userProfile?.role === 'admin' ? [
      { icon: UserCog, label: 'Servidores', path: '/servidores', category: 'Administração' },
      { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar', category: 'Administração' },
      { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar', category: 'Administração' },
      { icon: Shield, label: 'Logs de Auditoria', path: '/auditoria', category: 'Administração' },
      { icon: Settings, label: 'Configurações', path: '/configuracoes', category: 'Administração' }
    ] : [])
  ];

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 semei-btn-secondary rounded-xl shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 semei-sidebar transform transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="semei-sidebar-header relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SEMEI</h1>
                <p className="text-xs text-blue-100 font-medium">Cabo Frio</p>
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
        </div>

        {/* Navigation */}
        <nav className="semei-sidebar-content">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category} className="semei-sidebar-group">
              <h3 className="semei-sidebar-group-label">
                <div className="w-3 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                    (item.path === '/idosos' && location.pathname.startsWith('/idosos'));
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`group semei-sidebar-item ${
                        isActive
                          ? 'semei-sidebar-item-active'
                          : 'semei-sidebar-item-inactive'
                      }`}
                    >
                      <Icon size={18} className={`transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                      }`} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200/60 bg-slate-50/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto rounded-xl hover:bg-white/70 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
                    {userProfile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {userProfile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 shadow-xl border-0 bg-white/95 backdrop-blur-xl">
              <DropdownMenuItem className="p-3 hover:bg-blue-50 rounded-lg">
                <span className="font-medium">Perfil do Usuário</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="p-3 text-red-600 hover:bg-red-50 rounded-lg">
                <span className="font-medium">Sair do Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
