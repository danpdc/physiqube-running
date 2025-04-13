import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'; // Added maxWidth prop
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, maxWidth = 'md' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background">
      {/* Header with theme toggle */}
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className={`w-full max-w-${maxWidth}`}>
          {/* Card container */}
          <div className="bg-light-card dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
            {/* Logo and title area */}
            <div className="p-6 text-center border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-primary">
                <span className="text-primary">Physi</span>
                <span className="text-secondary">qube</span>
              </h1>
              {title && (
                <p className="mt-2 text-text-light-secondary dark:text-text-secondary">
                  {title}
                </p>
              )}
            </div>
            
            {/* Content area */}
            <div className="p-6">
              {children}
            </div>
          </div>
          
          {/* Footer links */}
          <div className="mt-4 text-center text-sm text-text-light-secondary dark:text-text-secondary">
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-primary">Help</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;