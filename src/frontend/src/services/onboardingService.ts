import api from './api';

// Type definitions aligned with backend SaveUserInfoRequest.cs
export interface SaveUserInfoRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  biologicalSex: 'male' | 'female' | 'other';
  restingHeartRate?: number;
  maxHeartRate?: number;
  weight?: number;
  height?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced' | null;
}

export interface SaveUserInfoResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Save user information during the onboarding process
 * @param userInfo The user information data
 * @returns Response from the API
 */
export const saveUserInfo = async (userInfo: SaveUserInfoRequest): Promise<SaveUserInfoResponse> => {
  try {
    // Convert biologicalSex from frontend format to backend format
    const biologicalSexValue = 
      userInfo.biologicalSex === 'male' ? 0 : 
      userInfo.biologicalSex === 'female' ? 1 : 2; // 'other'

    // Convert fitness level from frontend format to backend format
    let fitnessLevelValue = null;
    if (userInfo.fitnessLevel === 'beginner') fitnessLevelValue = 0;
    else if (userInfo.fitnessLevel === 'intermediate') fitnessLevelValue = 1;
    else if (userInfo.fitnessLevel === 'advanced') fitnessLevelValue = 2;

    // Convert string date to DateTimeOffset format expected by backend
    const apiRequest = {
      ...userInfo,
      biologicalSex: biologicalSexValue,
      fitnessLevel: fitnessLevelValue,
      dateOfBirth: new Date(userInfo.dateOfBirth).toISOString()
    };

    const response = await api.post<SaveUserInfoResponse>('/onboarding/userInfo', apiRequest);
    return response.data;
  } catch (error: any) {
    // Handle axios error and return structured error response
    if (error.response && error.response.data) {
      return {
        success: false,
        message: 'Failed to save user information',
        errors: error.response.data.errors || {}
      };
    }
    
    return {
      success: false,
      message: error.message || 'An unexpected error occurred'
    };
  }
};

export default {
  saveUserInfo
};