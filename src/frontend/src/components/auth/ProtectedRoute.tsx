import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * A component that protects routes by checking if the user is authenticated.
 * Redirects to the login page if not authenticated.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Show a message when redirecting unauthorized users
    toast.error('Please log in to access this page');
    
    // Redirect to login page, but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the children or the nested routes via Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;