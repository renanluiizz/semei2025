
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Shield, HelpCircle } from 'lucide-react';

export function UserMenu() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const userInitials = userProfile?.full_name
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase() || 'U';

  const userRole = userProfile?.role === 'admin' ? 'Administrador' : 'Servidor';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-blue-100">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900">
                {userProfile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {userRole}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 shadow-xl border-0 bg-white/95 backdrop-blur-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile?.full_name || 'Usuário'}
            </p>
            <p className="text-xs leading-none text-slate-500">
              {userProfile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => navigate('/perfil')} 
          className="p-3 hover:bg-blue-50 rounded-lg cursor-pointer"
        >
          <User className="h-4 w-4 mr-3 text-blue-600" />
          <span className="font-medium">Meu Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/configuracoes')} 
          className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-3 text-slate-600" />
          <span className="font-medium">Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
          <HelpCircle className="h-4 w-4 mr-3 text-slate-600" />
          <span className="font-medium">Ajuda & Suporte</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="p-3 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="font-medium">Sair do Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
