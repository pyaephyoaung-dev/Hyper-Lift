import api from './axiosConfig';
import { ProgressRequest, ProgressResponse, ApiResponse } from '../types/AppTypes';

const PROGRESS_URL = '/progress';

export const progressService = {
  getAllProgress: async (): Promise<ApiResponse<ProgressResponse[]>> => {
    const response = await api.get(PROGRESS_URL);
    return response.data;
  },

  getProgressById: async (id: number): Promise<ApiResponse<ProgressResponse>> => {
    const response = await api.get(`${PROGRESS_URL}/${id}`);
    return response.data;
  },

  getUserProgress: async (): Promise<ApiResponse<ProgressResponse[]>> => {
    const response = await api.get(`${PROGRESS_URL}/my`);
    return response.data;
  },

  createProgress: async (data: ProgressRequest): Promise<ApiResponse<ProgressResponse>> => {
    const response = await api.post(PROGRESS_URL, data);
    return response.data;
  },

  updateProgress: async (id: number, data: ProgressRequest): Promise<ApiResponse<ProgressResponse>> => {
    const response = await api.put(`${PROGRESS_URL}/${id}`, data);
    return response.data;
  },

  deleteProgress: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${PROGRESS_URL}/${id}`);
    return response.data;
  },
};

export default progressService;
