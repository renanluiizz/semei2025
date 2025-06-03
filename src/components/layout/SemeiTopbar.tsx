
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">SEMEI — Cabo Frio</h1>
            <p className="text-sm text-slate-600 font-medium">Secretaria da Melhor Idade</p>
          </div>
        </div>
      </div>

      {/* Right Side - User Actions */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="semei-btn-ghost rounded-xl w-10 h-10">
          <Search className="h-5 w-5 text-slate-500" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="semei-btn-ghost relative rounded-xl w-10 h-10">
          <Bell className="h-5 w-5 text-slate-500" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-xl transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border-0 rounded-xl">
            <DropdownMenuItem 
              onClick={() => navigate('/perfil')} 
              className="p-3 hover:bg-blue-50 rounded-lg cursor-pointer"
            >
              <User className="h-4 w-4 mr-3 text-blue-600" />
              <span className="font-medium">Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="p-3 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span className="font-medium">Sair do Sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
