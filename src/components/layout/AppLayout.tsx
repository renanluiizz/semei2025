
import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { GlobalSearch } from '@/components/GlobalSearch';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Sidebar */}
        <AppSidebar 
          onOpenSearch={() => setShowGlobalSearch(true)}
        />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AppHeader />

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <AppFooter />
        </SidebarInset>

        {/* Global Search */}
        <GlobalSearch 
          open={showGlobalSearch} 
          onClose={() => setShowGlobalSearch(false)} 
        />
      </div>
    </SidebarProvider>
  );
}
