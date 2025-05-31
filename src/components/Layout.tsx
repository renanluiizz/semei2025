
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
  Shield
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

  // Close sidebar on route change (mobile)
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
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-blue-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SEMEI</h1>
              <p className="text-xs text-blue-100">Secretaria da Melhor Idade</p>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="p-4 border-b border-gray-100">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-left h-10"
            onClick={() => setShowGlobalSearch(true)}
          >
            <Search className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-500 font-normal">Buscar no sistema...</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-blue-100 text-blue-800 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                      }`}
                    >
                      <Icon size={18} className={`transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                      }`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto rounded-xl hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {userProfile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userProfile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
                    </p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem onClick={() => navigate('/perfil')}>
                <User className="h-4 w-4 mr-2" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sair do Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{getCurrentPageTitle()}</h1>
              <p className="text-sm text-gray-500">Sistema de Monitoramento de Estruturas Institucionais</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
            <span>© 2024 Secretaria da Melhor Idade - SEMEI</span>
            <span>Sistema de Gestão Institucional v2.0</span>
          </div>
        </footer>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch 
        open={showGlobalSearch} 
        onClose={() => setShowGlobalSearch(false)} 
      />
    </div>
  );
}
