import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import AuthLayout from './components/layout/AuthLayout';
import { getGreeting } from './services/api';

function App() {
  // Check for stored theme preference on initial load
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // If no localStorage value, check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // For demo purposes - Simple "Home" component using AuthLayout
  const Home = () => {
    const [name, setName] = useState<string>('');
    const [greeting, setGreeting] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!name.trim()) {
        setError('Please enter a name');
        return;
      }
  
      setLoading(true);
      setError(null);
      
      try {
        const response = await getGreeting(name);
        setGreeting(response);
      } catch (err) {
        setError('Failed to fetch greeting. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <AuthLayout title="Welcome to PhysiqubeRunning">
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-text-light-secondary dark:text-text-secondary">
              Your personal running coach and training assistant
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-light-primary dark:text-text-primary mb-1">
                Enter Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-light-primary dark:text-text-primary"
                disabled={loading}
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full btn btn-primary">
              {loading ? 'Loading...' : 'Get Started'}
            </button>
          </form>
          
          {error && <div className="p-3 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm">{error}</div>}
          
          {greeting && (
            <div className="p-4 rounded-lg bg-light-background dark:bg-dark-background">
              <h3 className="font-medium text-text-light-primary dark:text-text-primary mb-1">Response from Server:</h3>
              <p className="text-text-light-secondary dark:text-text-secondary">{greeting}</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-4 pt-4">
            <a href="/login" className="text-secondary hover:underline">
              Sign In
            </a>
            <span className="text-text-light-secondary dark:text-text-secondary">•</span>
            <a href="/signup" className="text-secondary hover:underline">
              Create Account
            </a>
          </div>
        </div>
      </AuthLayout>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
