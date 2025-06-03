
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
  X
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
      <div className="semei-sidebar-header relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">SEMEI</h1>
              <p className="text-xs text-blue-100">Secretaria da Melhor Idade</p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-white hover:bg-white/10 w-8 h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar no sistema..."
            className="semei-input semei-search w-full pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="h-4 w-4 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="semei-sidebar-content">
        {menuSections.map((section) => (
          <div key={section.title} className="semei-sidebar-section">
            <h3 className="semei-sidebar-title">{section.title}</h3>
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
                    <Icon size={18} />
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
