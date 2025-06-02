
import { ReactNode } from 'react';
import { SemeiSidebar } from './SemeiSidebar';
import { SemeiTopbar } from './SemeiTopbar';
import { SemeiFooter } from './SemeiFooter';

interface SemeiLayoutProps {
  children: ReactNode;
}

export function SemeiLayout({ children }: SemeiLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <SemeiSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <SemeiTopbar />
        
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <SemeiFooter />
      </div>
    </div>
  );
}
