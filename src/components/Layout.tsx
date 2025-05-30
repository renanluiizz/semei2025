
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  Heart,
  Search,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';

export function Layout() {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Idosos', path: '/idosos' },
    { icon: UserPlus, label: 'Novo Cadastro', path: '/idosos/novo' },
    { icon: Calendar, label: 'Atividades', path: '/atividades' },
    { icon: Activity, label: 'Tipos de Atividade', path: '/tipos-atividade' },
    ...(userProfile?.role === 'admin' ? [
      { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar' },
      { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar' },
      { icon: Settings, label: 'Configurações', path: '/configuracoes' }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/95 backdrop-blur-sm border-r border-border/50 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-border/50 semei-header">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                SEMEI
              </h1>
              <p className="text-xs text-white/80">
                Secretaria da Melhor Idade
              </p>
            </div>
          </div>
        </div>

        {/* Busca Global */}
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-primary/20 hover:bg-primary/5 text-left"
            onClick={() => setShowGlobalSearch(true)}
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="text-gray-500">Buscar no sistema...</span>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* User Info */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Sair do Sistema
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="px-6 py-4 border-t border-border/50 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>© 2024 Secretaria da Melhor Idade - SEMEI</span>
            <span>Sistema de Gestão Institucional</span>
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
