import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://localhost:7083/api', // Default port for ASP.NET Core HTTPS
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const getGreeting = async (name: string): Promise<string> => {
  try {
    const response = await api.get(`/greeting?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching greeting:', error);
    throw error;
  }
};

export default api;