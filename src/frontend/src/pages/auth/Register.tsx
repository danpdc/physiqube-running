import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../../components/layout/AuthLayout';
import { registerUser, storeAuthToken } from '../../services/authService';

// Zod schema for form validation
const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Must be a valid email' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password cannot be more than 100 characters' }),
  confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

// Function to calculate password strength
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 4);
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  const password = watch('password', '');
  const passwordStrength = calculatePasswordStrength(password);
  
  const getStrengthColor = (strength: number): string => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    return colors[strength] || colors[0];
  };

  const getStrengthText = (strength: number): string => {
    const texts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    return texts[strength] || texts[0];
  };
  
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    
    try {
      const response = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      
      // Save token to localStorage
      storeAuthToken(response.token);
      
      toast.success('Registration successful! Redirecting to onboarding...');
      
      // Redirect to onboarding page
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        // Handle API validation errors
        const errorMsg = error.response.data.title || error.response.data.message || 'Registration failed';
        toast.error(errorMsg);
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout title="Create your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
              placeholder="John"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          
          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-light-secondary dark:text-text-secondary">
                  Password strength: {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStrengthColor(passwordStrength)} transition-all`} 
                  style={{ width: `${(passwordStrength + 1) * 20}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary py-2 px-4 flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
          Already have an account?{' '}
          <a href="/login" className="text-secondary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;