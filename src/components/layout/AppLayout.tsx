
import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { GlobalSearch } from '@/components/GlobalSearch';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  return (
    <div className="semei-page flex w-full min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onOpenSearch={() => setShowGlobalSearch(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <AppHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <AppFooter />
      </div>

      {/* Global Search */}
      <GlobalSearch 
        open={showGlobalSearch} 
        onClose={() => setShowGlobalSearch(false)} 
      />
    </div>
  );
}
