import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAuthenticated, getAuthToken, getUserData } from '../../services/authService';

/**
 * ProtectedRoute component that restricts access to routes based on authentication status.
 * Redirects unauthenticated users to the login page.
 */
const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Additional check to ensure token is valid
    const token = getAuthToken();
    if (!token) {
      return; // The main check below will handle redirection
    }
    
    // Check if there's user data from the token
    const userData = getUserData();
    if (!userData) {
      // Token is invalid or expired - redirect to login
      toast.error('Your session has expired. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);
  
  if (!isAuthenticated()) {
    // Redirect to login and store the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;