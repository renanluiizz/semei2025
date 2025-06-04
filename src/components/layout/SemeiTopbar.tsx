
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
    <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 h-16">
      {/* Left Side - System Info */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">SEMEI — Cabo Frio</h1>
          <p className="text-sm text-gray-600 font-medium">Secretaria da Melhor Idade</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar no sistema..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl 
                     focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors 
                     placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Side - User Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 
                         hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-xl border border-gray-200 rounded-xl">
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
