import React, { useState } from 'react';
import AuthLayout from '../../components/layout/AuthLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt', { email, password });
      setLoading(false);
      // Here you would redirect after successful login
    }, 800);
  };
  
  return (
    <AuthLayout title="Welcome back! Please sign in to your account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
            Email
          </label>
          <input
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
            Password
          </label>
          <input
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
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
          className="w-full btn btn-primary py-2 px-4 flex justify-center"
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Sign in'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-text-light-secondary dark:text-text-secondary">
          Don't have an account?{' '}
          <a href="/signup" className="text-secondary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;