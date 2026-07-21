import api from './axiosConfig';
import { LoginRequest, LoginResponse, RegisterRequest, UsernameAvailability, ApiResponse } from '../types/AppTypes';

const AUTH_URL = '/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post(`${AUTH_URL}/login`, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post(`${AUTH_URL}/register`, data);
    return response.data;
  },

  me: async (): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.get(`${AUTH_URL}/me`);
    return response.data;
  },

  checkUsername: async (username: string): Promise<ApiResponse<UsernameAvailability>> => {
    const response = await api.get(`${AUTH_URL}/check-username`, { params: { username } });
    return response.data;
  },

  checkEmail: async (email: string): Promise<ApiResponse<UsernameAvailability>> => {
    const response = await api.get(`${AUTH_URL}/check-email`, { params: { email } });
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(`${AUTH_URL}/logout`);
    } catch {
    }
  },
};

export default authService;
