
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell, Search } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SemeiTopbar() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <header className="semei-topbar">
      {/* Left Side - System Info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">SEMEI — Cabo Frio</h1>
            <p className="text-sm text-slate-600">Secretaria da Melhor Idade</p>
          </div>
        </div>
      </div>

      {/* Right Side - User Actions */}
      <div className="flex items-center gap-4">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="semei-btn-ghost">
          <Search className="h-5 w-5 text-slate-500" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="semei-btn-ghost relative">
          <Bell className="h-5 w-5 text-slate-500" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {userProfile?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {userProfile?.full_name || 'Renan Luiz da Silva Alves'}
                </p>
                <p className="text-xs text-slate-500">
                  {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl">
            <DropdownMenuItem onClick={() => navigate('/perfil')}>
              <User className="h-4 w-4 mr-3" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="h-4 w-4 mr-3" />
              <span>Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
