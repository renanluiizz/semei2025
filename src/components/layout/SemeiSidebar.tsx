
import { Link, useLocation } from 'react-router-dom';
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
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SemeiSidebarProps {
  onClose?: () => void;
}

export function SemeiSidebar({ onClose }: SemeiSidebarProps) {
  const { userProfile } = useAuth();
  const location = useLocation();

  const menuSections = [
    {
      title: "PRINCIPAL",
      items: [
        { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
        { icon: Users, label: 'Idosos', path: '/idosos' },
        { icon: UserPlus, label: 'Novo Cadastro', path: '/idosos/novo' },
      ]
    },
    {
      title: "ATIVIDADES", 
      items: [
        { icon: Calendar, label: 'Atividades', path: '/atividades' },
        { icon: Activity, label: 'Tipos de Atividade', path: '/tipos-atividade' },
      ]
    },
    ...(userProfile?.role === 'admin' ? [{
      title: "ADMINISTRAÇÃO",
      items: [
        { icon: UserCog, label: 'Servidores', path: '/servidores' },
        { icon: FileSpreadsheet, label: 'Importar Planilha', path: '/importar' },
        { icon: RotateCcw, label: 'Resetar Estatísticas', path: '/resetar' },
        { icon: Shield, label: 'Logs de Auditoria', path: '/auditoria' },
        { icon: Settings, label: 'Configurações', path: '/configuracoes' }
      ]
    }] : [])
  ];

  return (
    <>
      {/* Header */}
      <div className="semei-sidebar-header">
        <div className="flex items-center justify-between">
          <div className="semei-sidebar-logo">
            <div className="semei-sidebar-logo-icon">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="semei-sidebar-title">SEMEI</h1>
              <p className="semei-sidebar-subtitle">Sistema de Monitoramento</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/10 w-8 h-8 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="semei-sidebar-content">
        {menuSections.map((section) => (
          <div key={section.title} className="semei-sidebar-section">
            <h3 className="semei-sidebar-section-title">
              <div className="w-3 h-0.5 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path === '/idosos' && location.pathname.startsWith('/idosos'));
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`semei-sidebar-item ${
                      isActive ? 'semei-sidebar-item-active' : 'semei-sidebar-item-inactive'
                    }`}
                  >
                    <Icon className="semei-sidebar-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
