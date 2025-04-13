import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { removeAuthToken } from '../../services/authService';
import ConfirmDialog from './ConfirmDialog';

// Define a type for our user data stores
// This can be expanded as more client-side data stores are added
type UserDataStorage = {
  key: string;
  type: 'localStorage' | 'sessionStorage' | 'custom';
  clearMethod?: () => void;
};

// List of user data we want to clear on logout
const userDataStores: UserDataStorage[] = [
  { key: 'token', type: 'localStorage' },
  { key: 'user_preferences', type: 'localStorage' },
  { key: 'recent_activities', type: 'localStorage' },
  { key: 'training_data', type: 'localStorage' },
];

interface LogoutButtonProps {
  className?: string;
  variant?: 'link' | 'button';
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '',
  variant = 'button' 
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Clear all user-specific data from client-side storage
  const clearUserData = () => {
    // Clear each data store based on its type
    userDataStores.forEach(store => {
      if (store.type === 'localStorage') {
        localStorage.removeItem(store.key);
      } else if (store.type === 'sessionStorage') {
        sessionStorage.removeItem(store.key);
      } else if (store.type === 'custom' && store.clearMethod) {
        store.clearMethod();
      }
    });
    
    // Remove the auth token (this is our existing functionality)
    removeAuthToken();
    
    console.log('All user data cleared from client storage');
  };
  
  const handleLogoutClick = () => {
    // Show confirmation dialog instead of logging out immediately
    setShowConfirmation(true);
  };
  
  const handleConfirmLogout = () => {
    // Clear all user data
    clearUserData();
    
    // Close the dialog
    setShowConfirmation(false);
    
    // Show success notification
    toast.success('You have been successfully logged out');
    
    // Redirect to login page
    navigate('/login');
  };
  
  if (variant === 'link') {
    return (
      <>
        <button 
          onClick={handleLogoutClick}
          className={`text-secondary hover:underline ${className}`}
        >
          Log out
        </button>
        
        <ConfirmDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmLogout}
          title="Confirm Logout"
          message="Are you sure you want to log out? You will need to sign in again to access your account."
          confirmLabel="Log Out"
          cancelLabel="Cancel"
          confirmVariant="danger"
        />
      </>
    );
  }
  
  return (
    <>
      <button
        onClick={handleLogoutClick}
        className={`btn btn-secondary py-2 px-4 ${className}`}
      >
        Log out
      </button>
      
      <ConfirmDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        confirmVariant="danger"
      />
    </>
  );
};

export default LogoutButton;