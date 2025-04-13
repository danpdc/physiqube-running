import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../../components/layout/AuthLayout';
import { getAuthToken, getUserData } from '../../services/authService';
import Step1UserInfo from './onboarding/Step1UserInfo';
import Step2Goals from './onboarding/Step2Goals';
import Step3Preferences from './onboarding/Step3Preferences';
import Step4Completion from './onboarding/Step4Completion';

interface JwtPayload {
  sub: string;
  email: string;
  FirstName: string;
  LastName: string;
  exp: number;
  [key: string]: any;
}

interface UserData {
  // Step 1 - User Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  biologicalSex: 'male' | 'female' | '' | 'other';
  restingHR?: number;
  maxHR?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced' | '';
  
  // Step 2 - Goals
  primaryGoal: 'get-fitter' | 'build-consistency' | 'race' | '';
  raceDistance?: '5k' | '10k' | 'half-marathon' | 'marathon' | 'ultra' | '';
  raceDate?: string;
  weeklyTrainingDays?: number;
  
  // Step 3 - Preferences
  measurementSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  connectStrava: boolean;
}

const Onboarding: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    biologicalSex: '',
    measurementSystem: 'metric',
    theme: 'dark',
    primaryGoal: '',
    connectStrava: false
  });
  
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
      
      // Set the user's first name and update userData with name info
      const userInfo = getUserData();
      if (userInfo) {
        setFirstName(userInfo.firstName);
        setUserData(prev => ({
          ...prev,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName
        }));
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      toast.error('Authentication error. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  const updateUserData = (stepData: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...stepData }));
  };

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompletion = () => {
    // Here you would typically save all collected data to backend
    toast.success('Profile setup complete! Welcome to Physiqube Running.');
    navigate('/dashboard');
  };

  // Stepper component
  const Stepper = () => {
    return (
      <div className="w-full mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <React.Fragment key={step}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div 
                  className={`flex items-center justify-center rounded-full w-10 h-10 font-medium border-2 
                    ${currentStep >= step 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-light-background dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-text-light-secondary dark:text-text-secondary'
                    }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-2 text-center text-text-light-secondary dark:text-text-secondary">
                  {step === 1 && "Profile"}
                  {step === 2 && "Goals"}
                  {step === 3 && "Settings"}
                  {step === 4 && "Complete"}
                </span>
              </div>
              
              {/* Connector line between steps */}
              {step < 4 && (
                <div className="flex-1 mx-2 h-0.5 bg-gray-300 dark:bg-gray-600">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${currentStep > step ? '100%' : '0%'}` }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1UserInfo 
            userData={userData}
            updateUserData={updateUserData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2Goals
            userData={userData}
            updateUserData={updateUserData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <Step3Preferences
            userData={userData}
            updateUserData={updateUserData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <Step4Completion
            firstName={firstName}
            userData={userData}
            onComplete={handleCompletion}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <AuthLayout title="Welcome to Physiqube Running" maxWidth="2xl">
      <div className="w-full">
        <Stepper />
        <div className="transition-all duration-300">
          {renderStep()}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Onboarding;