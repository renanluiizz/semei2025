
import { ReactNode, useState } from 'react';
import { SemeiSidebar } from './SemeiSidebar';
import { SemeiTopbar } from './SemeiTopbar';
import { SemeiFooter } from './SemeiFooter';
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
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">SEMEI</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="semei-btn-ghost rounded-xl"
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

        {/* Footer */}
        <SemeiFooter />
      </div>
    </div>
  );
}
