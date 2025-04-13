import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';
import { UserData } from '../../services/authService';

interface TopbarProps {
  userData: UserData | null;
}

const Topbar: React.FC<TopbarProps> = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState<'metric' | 'imperial'>('metric');

  const toggleMeasurementUnit = () => {
    setMeasurementUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  // Use user data or fallback values
  const firstName = userData?.firstName || 'Runner';
  const initials = userData?.initials || 'R';

  return (
    <div className="h-16 bg-light-card dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
      <div className="flex-1">
        <h2 className="text-lg font-medium text-text-light-primary dark:text-text-primary">
          Welcome, <span className="text-primary">{firstName}</span>
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Measurement toggle */}
        <div className="flex items-center gap-2 bg-light-background dark:bg-dark-background rounded-full p-1">
          <button
            onClick={toggleMeasurementUnit}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              measurementUnit === 'metric'
                ? 'bg-primary text-white'
                : 'text-text-light-secondary dark:text-text-secondary'
            }`}
          >
            Metric
          </button>
          <button
            onClick={toggleMeasurementUnit}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              measurementUnit === 'imperial'
                ? 'bg-primary text-white'
                : 'text-text-light-secondary dark:text-text-secondary'
            }`}
          >
            Imperial
          </button>
        </div>
        
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* User dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-text-light-primary dark:text-text-primary">
              {initials}
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 text-text-light-secondary dark:text-text-secondary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-light-card dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-text-light-primary dark:text-text-primary">
                  {userData?.fullName || 'Runner'}
                </p>
                <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                  {userData?.email || ''}
                </p>
              </div>
              <a href="/profile" className="block px-4 py-2 text-sm hover:bg-light-background dark:hover:bg-dark-background text-text-light-primary dark:text-text-primary">
                Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm hover:bg-light-background dark:hover:bg-dark-background text-text-light-primary dark:text-text-primary">
                Settings
              </a>
              <hr className="my-1 border-gray-200 dark:border-gray-800" />
              <div className="px-4 py-2 text-sm hover:bg-light-background dark:hover:bg-dark-background">
                <LogoutButton variant="link" className="w-full text-left text-red-600 dark:text-red-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;