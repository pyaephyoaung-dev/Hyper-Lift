import api from './axiosConfig';
import { ProfileUpdateRequest, UserResponse, ApiResponse } from '../types/AppTypes';

const USER_URL = '/users';

export const userService = {
  getAllUsers: async (): Promise<ApiResponse<UserResponse[]>> => {
    const response = await api.get(USER_URL);
    return response.data;
  },

  getUserById: async (id: number): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get(`${USER_URL}/${id}`);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await api.get(`${USER_URL}/profile`);
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<ApiResponse<UserResponse>> => {
    const response = await api.put(`${USER_URL}/profile`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${USER_URL}/${id}`);
    return response.data;
  },
};

export default userService;
