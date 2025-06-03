
import { ReactNode, useState } from 'react';
import { SemeiSidebar } from './SemeiSidebar';
import { SemeiTopbar } from './SemeiTopbar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SemeiLayoutProps {
  children: ReactNode;
}

export function SemeiLayout({ children }: SemeiLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="semei-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`semei-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <SemeiSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="semei-main">
        {/* Mobile Header */}
        <div className="semei-mobile-header">
          <div className="semei-mobile-logo">
            <div className="semei-topbar-logo">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">SEMEI</h1>
              <p className="text-xs text-gray-500">Sistema de Monitoramento</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="semei-mobile-menu-btn"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Topbar */}
        <SemeiTopbar />
        
        {/* Content */}
        <main className="semei-content">
          <div className="semei-container animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
