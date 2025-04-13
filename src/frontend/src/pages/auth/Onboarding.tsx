import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../../components/layout/AuthLayout';
import { getAuthToken } from '../../services/authService';

interface JwtPayload {
  sub: string;
  email: string;
  FirstName: string;
  LastName: string;
  exp: number;
  [key: string]: any;
}

const Onboarding: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get token from localStorage using our auth service
    const token = getAuthToken();
    
    if (!token) {
      // If no token exists, redirect to login
      toast.error('Authentication required. Please log in.');
      navigate('/login');
      return;
    }
    
    try {
      // Decode the token to get user info
      const decodedToken = jwtDecode<JwtPayload>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }
      
      // Set the user's first name
      setFirstName(decodedToken.FirstName || '');
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Authentication error. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <AuthLayout title="Welcome to Physiqube Running">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-4">
          Onboarding for {firstName}
        </h2>
        
        <p className="text-text-light-secondary dark:text-text-secondary mb-6">
          Thank you for registering! Let's set up your running profile.
        </p>
        
        {/* Here you can add additional onboarding steps */}
        <div className="space-y-6">
          <div className="p-4 bg-light-background dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-text-light-primary dark:text-text-primary mb-2">
              Set your running goals
            </h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              This will help us personalize your experience
            </p>
          </div>
          
          <div className="p-4 bg-light-background dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-text-light-primary dark:text-text-primary mb-2">
              Connect your running devices
            </h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              Sync your data from your favorite running devices
            </p>
          </div>
          
          <div className="p-4 bg-light-background dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-text-light-primary dark:text-text-primary mb-2">
              Find running buddies
            </h3>
            <p className="text-sm text-text-light-secondary dark:text-text-secondary">
              Connect with others who share your passion for running
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-8 w-full btn btn-primary py-2 px-4"
        >
          Complete Onboarding
        </button>
      </div>
    </AuthLayout>
  );
};

export default Onboarding;