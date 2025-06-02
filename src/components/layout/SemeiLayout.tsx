
import { ReactNode } from 'react';
import { SemeiSidebar } from './SemeiSidebar';
import { SemeiTopbar } from './SemeiTopbar';
import { SemeiFooter } from './SemeiFooter';

interface SemeiLayoutProps {
  children: ReactNode;
}

export function SemeiLayout({ children }: SemeiLayoutProps) {
  return (
    <div className="semei-page flex">
      {/* Sidebar */}
      <SemeiSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <SemeiTopbar />
        
        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
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
