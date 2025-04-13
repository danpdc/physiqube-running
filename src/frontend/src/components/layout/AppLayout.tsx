import React from 'react';
import Sidebar from '../ui/Sidebar';
import Topbar from '../ui/Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  username?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, username = 'Runner' }) => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="pl-64"> {/* Same width as Sidebar */}
        {/* Top bar */}
        <Topbar username={username} />
        
        {/* Content area */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;