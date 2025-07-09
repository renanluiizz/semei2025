
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart3, 
  Users, 
  Calendar,
  Settings,
  UserPlus,
  Activity,
  Search,
  FileSpreadsheet,
  RotateCcw,
  Shield,
  UserCog,
  Award
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AppSidebarProps {
  onOpenSearch: () => void;
}

export function AppSidebar({ onOpenSearch }: AppSidebarProps) {
  const { userProfile } = useAuth();
  const location = useLocation();
  const { collapsed } = useSidebar();

  const isActive = (path: string) => {
    if (path === '/' || path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const mainItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Idosos', path: '/idosos' },
    { icon: UserPlus, label: 'Novo Cadastro', path: '/idosos/novo' },
  ];

  const activityItems = [
    { icon: Calendar, label: 'Atividades', path: '/atividades' },
    { icon: Activity, label: 'Tipos de Atividade', path: '/tipos-atividade' },
  ];

  const adminItems = userProfile?.role === 'admin' ? [
    { icon: UserCog, label: 'Servidores', path: '/servidores' },
    { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar' },
    { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar' },
    { icon: Shield, label: 'Logs de Auditoria', path: '/auditoria' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' }
  ] : [];

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">SEMEI</h1>
              <p className="text-xs text-gray-600 font-medium">Secretaria da Melhor Idade</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Search Button */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-left h-11 transition-all duration-200"
            onClick={onOpenSearch}
          >
            <Search className="h-4 w-4 mr-3 text-gray-400" />
            <span className="text-gray-500 font-medium">Buscar no sistema...</span>
          </Button>
        </div>
      )}

      {/* Navigation */}
      <SidebarContent>
        {/* Principal */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path} className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Atividades */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4">
            Atividades
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activityItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path} className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors">
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administração */}
        {adminItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4">
              Administração
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                      <Link to={item.path} className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors">
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 ring-2 ring-blue-100">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs">
              {userProfile?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {userProfile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile?.role === 'admin' ? 'Administrador' : 'Servidor'}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
