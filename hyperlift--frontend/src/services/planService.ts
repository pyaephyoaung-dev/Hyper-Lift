import api from './axiosConfig';
import { WorkoutPlanRequest, WorkoutPlanResponse, ApiResponse } from '../types/AppTypes';

const PLAN_URL = '/workout-plans';

export const planService = {
  getAllPlans: async (): Promise<ApiResponse<WorkoutPlanResponse[]>> => {
    const response = await api.get(PLAN_URL);
    return response.data;
  },

  getPlanById: async (id: number): Promise<ApiResponse<WorkoutPlanResponse>> => {
    const response = await api.get(`${PLAN_URL}/${id}`);
    return response.data;
  },

  matchPlans: async (daysPerWeek: number): Promise<ApiResponse<WorkoutPlanResponse[]>> => {
    const response = await api.get(`${PLAN_URL}/match`, { params: { daysPerWeek } });
    return response.data;
  },

  getMyActivePlan: async (): Promise<ApiResponse<WorkoutPlanResponse | null>> => {
    const response = await api.get(`${PLAN_URL}/active/my`);
    return response.data;
  },

  selectPlan: async (id: number): Promise<ApiResponse<WorkoutPlanResponse>> => {
    const response = await api.post(`${PLAN_URL}/${id}/select`);
    return response.data;
  },

  createPlan: async (data: WorkoutPlanRequest): Promise<ApiResponse<WorkoutPlanResponse>> => {
    const response = await api.post(PLAN_URL, data);
    return response.data;
  },

  updatePlan: async (id: number, data: WorkoutPlanRequest): Promise<ApiResponse<WorkoutPlanResponse>> => {
    const response = await api.put(`${PLAN_URL}/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${PLAN_URL}/${id}`);
    return response.data;
  },
};

export default planService;
