import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthLayout from '../../components/layout/AuthLayout';
import { loginUser, storeAuthToken } from '../../services/authService';

// Zod schema for form validation
const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Must be a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password
      });
      
      // Save token to localStorage
      storeAuthToken(response.token);
      
      toast.success('Login successful!');
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data) {
        const errorMsg = error.response.data.title || error.response.data.message || 'Login failed';
        toast.error(errorMsg);
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthLayout title="Welcome back! Please sign in to your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-light-secondary dark:text-text-secondary">
              Remember me
            </label>
          </div>
          
          <a href="#" className="text-sm text-secondary hover:underline">
            Forgot password?
          </a>
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
              Signing in...
            </>
          ) : 'Sign in'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
          Don't have an account?{' '}
          <a href="/register" className="text-secondary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;