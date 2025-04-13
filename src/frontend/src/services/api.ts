import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'https://localhost:7083/api', // Default port for ASP.NET Core HTTPS
});

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