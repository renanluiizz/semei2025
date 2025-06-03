
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
      <div className="semei-topbar-left">
        <div className="semei-topbar-logo">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div>
          <h1 className="semei-topbar-title">SEMEI — Cabo Frio</h1>
          <p className="semei-topbar-subtitle">Secretaria da Melhor Idade</p>
        </div>
      </div>

      {/* Right Side - Search and User Actions */}
      <div className="semei-topbar-right">
        {/* Search */}
        <div className="semei-search-container">
          <Search className="semei-search-icon" />
          <input
            type="text"
            placeholder="Buscar no sistema..."
            className="semei-search-input"
          />
        </div>

        {/* Notifications */}
        <button className="semei-icon-button">
          <Bell className="h-5 w-5" />
          <div className="semei-notification-badge"></div>
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <div className="semei-user-avatar">
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
