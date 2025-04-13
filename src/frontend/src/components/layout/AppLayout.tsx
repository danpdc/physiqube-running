import React, { useEffect, useState } from 'react';
import Sidebar from '../ui/Sidebar';
import Topbar from '../ui/Topbar';
import { getUserData, UserData } from '../../services/authService';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    // Get user data from token when component mounts
    const data = getUserData();
    setUserData(data);
  }, []);
  
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="pl-64"> {/* Same width as Sidebar */}
        {/* Top bar */}
        <Topbar userData={userData} />
        
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