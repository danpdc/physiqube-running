import React from 'react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive = false }) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-white' 
          : 'text-text-light-secondary dark:text-text-secondary hover:bg-light-card dark:hover:bg-dark-card'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  // Current path could be determined from React Router
  const currentPath = window.location.pathname;
  
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-light-background dark:bg-dark-background border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-2xl">Physiqube</span>
        </Link>
      </div>
      
      <nav className="space-y-1">
        <NavItem 
          href="/dashboard" 
          label="Dashboard" 
          isActive={currentPath === '/dashboard'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
        
        <NavItem 
          href="/training-plan" 
          label="Training Plan" 
          isActive={currentPath === '/training-plan'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
        
        <NavItem 
          href="/progress" 
          label="Progress" 
          isActive={currentPath === '/progress'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        
        <NavItem 
          href="/settings" 
          label="Settings" 
          isActive={currentPath === '/settings'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </nav>
      
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-sm text-text-light-secondary dark:text-text-secondary">
          <p>© {new Date().getFullYear()} Physiqube</p>
          <p>Version 0.1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;