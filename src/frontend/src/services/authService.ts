import api from './api';

// Type definitions
export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  userId: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  email: string;
  token: string;
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns RegisterUserResponse containing user info and authentication token
 */
export const registerUser = async (userData: RegisterUserRequest): Promise<RegisterUserResponse> => {
  const response = await api.post<RegisterUserResponse>('/auth/register', userData);
  return response.data;
};

/**
 * Log in an existing user
 * @param credentials User login credentials
 * @returns LoginResponse containing user info and authentication token
 */
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * Store the authentication token in localStorage
 * @param token The JWT token to store
 */
export const storeAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Get the authentication token from localStorage
 * @returns The stored JWT token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if a user is authenticated (has a token)
 * @returns Boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default {
  registerUser,
  loginUser,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated
};