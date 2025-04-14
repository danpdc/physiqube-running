import React, { useState, useEffect } from 'react';
// Use barrel imports from the ui directory - removed Alert, AlertDescription, and AlertTitle imports
import { Button, Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';
// Import react-datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css'; // Import custom styles for date picker
// Import the onboarding service
import onboardingService from '../../../services/onboardingService';

// Inline SVG icon as a component
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

// Inline SVG icon for alert notification X to close button
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface UserData {
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  biologicalSex: 'male' | 'female' | 'other' | '';
  restingHeartRate?: number;
  maxHeartRate?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced' | '';
}

interface Step1UserInfoProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

const Step1UserInfo: React.FC<Step1UserInfoProps> = ({ userData, updateUserData, onNext }) => {
  // Animation control
  const [animationStage, setAnimationStage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserData>({
    firstName: userData.firstName,
    lastName: userData.lastName,
    dateOfBirth: userData.dateOfBirth !== undefined ? userData.dateOfBirth : '',
    biologicalSex: userData.biologicalSex !== undefined ? userData.biologicalSex : '',
    restingHeartRate: userData.restingHeartRate !== undefined ? userData.restingHeartRate : undefined,
    maxHeartRate: userData.maxHeartRate !== undefined ? userData.maxHeartRate : undefined,
    weight: userData.weight !== undefined ? userData.weight : undefined,
    height: userData.height !== undefined ? userData.height : undefined,
    fitnessLevel: userData.fitnessLevel !== undefined ? userData.fitnessLevel : ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [date, setDate] = useState<Date | null>(
    formData.dateOfBirth ? new Date(formData.dateOfBirth) : null
  );

  // Progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStage < 3) {
        setAnimationStage(prev => prev + 1);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [animationStage]);

  const handleChange = <K extends keyof UserData>(field: K, value: UserData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear API error when any field changes
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields - removed firstName validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if date is valid and user is at least 13 years old
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const minAge = 13;
      
      today.setFullYear(today.getFullYear() - minAge);
      
      if (isNaN(birthDate.getTime())) {
        newErrors.dateOfBirth = 'Invalid date';
      } else if (birthDate > today) {
        newErrors.dateOfBirth = `You must be at least ${minAge} years old`;
      }
    }
    
    if (!formData.biologicalSex) {
      newErrors.biologicalSex = 'Please select an option';
    }
    
    // Optional fields validation
    if (formData.restingHeartRate !== undefined) {
      if (formData.restingHeartRate < 30 || formData.restingHeartRate > 120) {
        newErrors.restingHeartRate = 'Typically between 30-120 bpm';
      }
    }
    
    if (formData.maxHeartRate !== undefined) {
      if (formData.maxHeartRate < 120 || formData.maxHeartRate > 220) {
        newErrors.maxHeartRate = 'Typically between 120-220 bpm';
      }
    }
    
    if (formData.weight !== undefined) {
      if (formData.weight < 30 || formData.weight > 300) {
        newErrors.weight = 'Please enter a valid weight';
      }
    }
    
    if (formData.height !== undefined) {
      if (formData.height < 100 || formData.height > 250) {
        newErrors.height = 'Please enter a valid height';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setApiError(null);
      
      // Calculate max HR if not provided but we have age
      if (!formData.maxHeartRate && formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        // Using the common formula: 220 - age
        const estimatedMaxHR = 220 - age;
        setFormData(prev => ({ ...prev, maxHeartRate: estimatedMaxHR }));
      }
      
      try {
        // Only send the request if biologicalSex is selected
        if (formData.biologicalSex) {
          const response = await onboardingService.saveUserInfo({
            ...formData, 
            biologicalSex: formData.biologicalSex as 'male' | 'female' | 'other',
            fitnessLevel: formData.fitnessLevel as 'beginner' | 'intermediate' | 'advanced' | null
          });
          
          if (response.success) {
            // Update parent component with the data
            updateUserData(formData);
            // Proceed to next step
            onNext();
          } else {
            // Handle API error
            setApiError(response.message || 'Failed to save user information. Please try again.');
            
            // Map backend validation errors to form fields if available
            if (response.errors) {
              const fieldErrors: Record<string, string> = {};
              Object.entries(response.errors).forEach(([key, messages]) => {
                // Convert API error field name to camelCase to match frontend fields
                const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                fieldErrors[fieldName] = messages[0];
              });
              setErrors(fieldErrors);
            }
          }
        } else {
          // Should not happen due to validation, but just in case
          setErrors(prev => ({ ...prev, biologicalSex: 'Please select an option' }));
        }
      } catch (error) {
        console.error('Error saving user information:', error);
        setApiError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      handleChange('dateOfBirth', dateString);
      
      // Calculate max heart rate based on age if the field isn't set
      if (!formData.maxHeartRate) {
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const estimatedMaxHR = 220 - age;
        setFormData(prev => ({ ...prev, maxHeartRate: estimatedMaxHR }));
      }
    }
  };

  // Calculate maximum date (must be at least 13 years old)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  // Custom input for the date picker to match our UI
  const CustomInput = React.forwardRef<HTMLButtonElement, {
    value?: string;
    onClick?: () => void;
    className?: string;
    hasError?: boolean;
  }>((props, ref) => (
    <button
      type="button"
      className={cn(
        "w-full bg-transparent flex items-center text-left px-3 py-2 border rounded-md h-10",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "dark:bg-gray-900 dark:border-gray-700",
        !props.value && "text-text-light-secondary dark:text-text-secondary",
        props.hasError && "border-red-500",
        props.className
      )}
      onClick={props.onClick}
      ref={ref}
    >
      <CalendarIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
      {props.value || "Select your birth date"}
    </button>
  ));
  CustomInput.displayName = "CustomInput";

  return (
    <div className="py-4 px-2 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-3"
        >
          Let's Get to Know You!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-text-light-secondary dark:text-text-secondary"
        >
          This helps us personalize your experience and training.
        </motion.p>
      </div>

      {/* Custom Error Alert - replacing Alert components */}
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-red-800 font-medium">Error</h3>
              <p className="text-red-700 mt-1">{apiError}</p>
            </div>
            <button 
              type="button"
              className="text-red-500 hover:text-red-700 p-1"
              onClick={() => setApiError(null)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Health Basics Section - First section, always visible */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <span role="img" aria-label="target">🎯</span> Health Basics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div>
                <Label htmlFor="dateOfBirth" className="mb-2 block">
                  Date of Birth <span className="text-red-500">*</span>
                  <span className="block text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                    Used to estimate max heart rate, calculate HR zones
                  </span>
                </Label>
                <div className={errors.dateOfBirth ? 'mb-1' : ''}>
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    maxDate={maxDate}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select your birth date"
                    className={cn(
                      "w-full px-3 py-2 border rounded-md h-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                      "dark:bg-gray-900 dark:border-gray-700",
                      errors.dateOfBirth && "border-red-500"
                    )}
                    customInput={<CustomInput hasError={!!errors.dateOfBirth} />}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                )}
              </div>
              
              {/* Biological Sex */}
              <div>
                <Label className="mb-2 block">
                  Biological Sex <span className="text-red-500">*</span>
                  <span className="block text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                    Impacts HR zone estimates and calorie burn
                  </span>
                </Label>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={formData.biologicalSex === 'male' ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      errors.biologicalSex && !formData.biologicalSex ? 'border-red-500' : ''
                    )}
                    onClick={() => handleChange('biologicalSex', 'male')}
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant={formData.biologicalSex === 'female' ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      errors.biologicalSex && !formData.biologicalSex ? 'border-red-500' : ''
                    )}
                    onClick={() => handleChange('biologicalSex', 'female')}
                  >
                    Female
                  </Button>
                  <Button
                    type="button"
                    variant={formData.biologicalSex === 'other' ? "default" : "outline"}
                    className={cn(
                      "flex-1",
                      errors.biologicalSex && !formData.biologicalSex ? 'border-red-500' : ''
                    )}
                    onClick={() => handleChange('biologicalSex', 'other')}
                  >
                    Other
                  </Button>
                </div>
                {errors.biologicalSex && (
                  <p className="text-red-500 text-sm mt-2">{errors.biologicalSex}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Heart Rate Details - Appears after short delay */}
          {animationStage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span role="img" aria-label="heart">❤️</span> Heart Rate Details <span className="text-text-light-secondary dark:text-text-secondary text-sm">(optional)</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resting Heart Rate */}
                <div>
                  <Label htmlFor="restingHeartRate" className="mb-2 block">
                    Resting Heart Rate (bpm)
                    <span className="block text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                      Improves accuracy of HR zone estimates
                    </span>
                  </Label>
                  <div className="space-y-5">
                    <Slider
                      value={[formData.restingHeartRate || 60]}
                      min={40}
                      max={100}
                      step={1}
                      onValueChange={(values) => handleChange('restingHeartRate', values[0])}
                    />
                    <div className="flex justify-between">
                      <span className="text-xs">40</span>
                      <Input
                        type="number"
                        value={formData.restingHeartRate || ''}
                        onChange={(e) => handleChange('restingHeartRate', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-16 h-8 text-center mx-2"
                      />
                      <span className="text-xs">100</span>
                    </div>
                  </div>
                  {errors.restingHeartRate && (
                    <p className="text-red-500 text-sm mt-1">{errors.restingHeartRate}</p>
                  )}
                </div>
                
                {/* Max Heart Rate */}
                <div>
                  <Label htmlFor="maxHeartRate" className="mb-2 block">
                    Max Heart Rate (bpm)
                    <span className="block text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                      {formData.dateOfBirth ? "Estimated based on your age" : "If not provided, will estimate based on age"}
                    </span>
                  </Label>
                  <div className="space-y-5">
                    <Slider
                      value={[formData.maxHeartRate || 180]}
                      min={140}
                      max={220}
                      step={1}
                      onValueChange={(values) => handleChange('maxHeartRate', values[0])}
                    />
                    <div className="flex justify-between">
                      <span className="text-xs">140</span>
                      <Input
                        type="number"
                        value={formData.maxHeartRate || ''}
                        onChange={(e) => handleChange('maxHeartRate', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-16 h-8 text-center mx-2"
                      />
                      <span className="text-xs">220</span>
                    </div>
                  </div>
                  {errors.maxHeartRate && (
                    <p className="text-red-500 text-sm mt-1">{errors.maxHeartRate}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Body Metrics - Appears after short delay */}
          {animationStage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Body Metrics <span className="text-text-light-secondary dark:text-text-secondary text-sm">(optional)</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight */}
                <div>
                  <Label htmlFor="weight" className="mb-2 block">
                    Weight (kg)
                    <span className="block text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                      Can be used for calorie burn, BMI
                    </span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : undefined)}
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>
                
                {/* Height */}
                <div>
                  <Label htmlFor="height" className="mb-2 block">
                    Height (cm)
                    <span className="block text-xs text-text-light-secondary dark:text-text-secondary mt-1">
                      Can be used for BMI
                    </span>
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : undefined)}
                    className={errors.height ? 'border-red-500' : ''}
                  />
                  {errors.height && (
                    <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Fitness Level - Appears after short delay */}
          {animationStage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                Fitness Level <span className="text-text-light-secondary dark:text-text-secondary text-sm">(optional)</span>
              </h2>
              
              <div className="mt-2">
                <Label htmlFor="fitnessLevel" className="mb-2 block">
                  Your current fitness level
                </Label>
                <Select 
                  value={formData.fitnessLevel || ''} 
                  onValueChange={(value) => handleChange('fitnessLevel', value as UserData['fitnessLevel'])}
                >
                  <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-12 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting ? (
              <>
                <span className="opacity-0">Next</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : "Next"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step1UserInfo;