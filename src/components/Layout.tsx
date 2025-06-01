
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearch } from '@/components/GlobalSearch';
import { 
  User,
  BarChart3, 
  Users, 
  Calendar,
  Settings,
  LogOut,
  UserPlus,
  Activity,
  Search,
  FileSpreadsheet,
  RotateCcw,
  Menu,
  Bell,
  ChevronDown,
  Shield,
  UserCog,
  X
} from 'lucide-react';

export function Layout() {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => 
      location.pathname === item.path || 
      (item.path === '/idosos' && location.pathname.startsWith('/idosos'))
    );
    return currentItem?.label || 'SEMEI';
  };

  return (
    <div className="semei-page flex w-full">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 semei-sidebar transform transition-all duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="semei-sidebar-header relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SEMEI</h1>
                <p className="text-xs text-blue-100 font-medium">Secretaria da Melhor Idade</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/10 w-8 h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Button */}
        <div className="p-4 border-b border-slate-200/60">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-left h-11 transition-all duration-200"
            onClick={() => setShowGlobalSearch(true)}
          >
            <Search className="h-4 w-4 mr-3 text-slate-400" />
            <span className="text-slate-500 font-medium">Buscar no sistema...</span>
          </Button>
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

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200/60 bg-slate-50/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto rounded-xl hover:bg-white/70 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                      {userProfile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
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
              <DropdownMenuItem onClick={() => navigate('/perfil')} className="p-3 hover:bg-blue-50 rounded-lg">
                <User className="h-4 w-4 mr-3 text-blue-600" />
                <span className="font-medium">Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={handleSignOut} className="p-3 text-red-600 hover:bg-red-50 rounded-lg">
                <LogOut className="h-4 w-4 mr-3" />
                <span className="font-medium">Sair do Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="semei-header sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-xl w-10 h-10 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{getCurrentPageTitle()}</h1>
              <p className="text-sm text-slate-600 font-medium">Sistema de Monitoramento de Estruturas Institucionais</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl w-10 h-10 hover:bg-slate-100 relative">
              <Bell className="h-5 w-5 text-slate-500" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="semei-container animate-fade-in">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="px-6 lg:px-8 py-4 border-t border-slate-200/60 bg-white/60 backdrop-blur-xl">
          <div className="semei-container flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span className="font-medium">© 2024 Secretaria da Melhor Idade - SEMEI</span>
            <span className="font-medium">Sistema de Gestão Institucional v2.0</span>
          </div>
        </footer>
      </div>

      {/* Global Search */}
      <GlobalSearch 
        open={showGlobalSearch} 
        onClose={() => setShowGlobalSearch(false)} 
      />
    </div>
  );
}
