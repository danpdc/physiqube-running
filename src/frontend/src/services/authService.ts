import api from './api';
import { jwtDecode } from 'jwt-decode';

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

// JWT payload interface
export interface JwtPayload {
  sub: string;
  email: string;
  FirstName: string;
  LastName: string;
  exp: number;
  [key: string]: any;
}

// User data interface extracted from token
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
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

/**
 * Get user data from the JWT token
 * @returns User data or null if not authenticated
 */
export const getUserData = (): UserData | null => {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      removeAuthToken(); // Remove expired token
      return null;
    }
    
    // Extract user data from token
    const firstName = decoded.FirstName || '';
    const lastName = decoded.LastName || '';
    
    return {
      id: decoded.sub,
      email: decoded.email,
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export default {
  registerUser,
  loginUser,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  getUserData
};