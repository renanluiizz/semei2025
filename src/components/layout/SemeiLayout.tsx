
import { ReactNode, useState } from 'react';
import { SemeiSidebar } from './SemeiSidebar';
import { SemeiTopbar } from './SemeiTopbar';
import { Menu, X } from 'lucide-react';
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`semei-sidebar ${sidebarOpen ? 'open' : ''} lg:translate-x-0`}>
        <SemeiSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="semei-main">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4 bg-white border-b border-slate-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="semei-btn-ghost"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Topbar */}
        <SemeiTopbar />
        
        {/* Content */}
        <main className="semei-content">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
