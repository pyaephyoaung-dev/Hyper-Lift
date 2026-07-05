import api from './axiosConfig';
import { WorkoutSplitRequest, WorkoutSplitResponse, ApiResponse } from '../types/AppTypes';

const SPLIT_URL = '/workout-splits';

export const splitService = {
  getAllSplits: async (): Promise<ApiResponse<WorkoutSplitResponse[]>> => {
    const response = await api.get(SPLIT_URL);
    return response.data;
  },

  getSplitById: async (id: number): Promise<ApiResponse<WorkoutSplitResponse>> => {
    const response = await api.get(`${SPLIT_URL}/${id}`);
    return response.data;
  },

  getSplitsByPlanId: async (planId: number): Promise<ApiResponse<WorkoutSplitResponse[]>> => {
    const response = await api.get(`${SPLIT_URL}/plan/${planId}`);
    return response.data;
  },

  createSplit: async (data: WorkoutSplitRequest): Promise<ApiResponse<WorkoutSplitResponse>> => {
    const response = await api.post(SPLIT_URL, data);
    return response.data;
  },

  updateSplit: async (id: number, data: WorkoutSplitRequest): Promise<ApiResponse<WorkoutSplitResponse>> => {
    const response = await api.put(`${SPLIT_URL}/${id}`, data);
    return response.data;
  },

  deleteSplit: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${SPLIT_URL}/${id}`);
    return response.data;
  },
};

export default splitService;
