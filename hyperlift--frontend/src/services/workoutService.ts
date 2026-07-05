import api from './axiosConfig';
import { WorkoutRequest, WorkoutResponse, ApiResponse } from '../types/AppTypes';

const WORKOUT_URL = '/workouts';

export const workoutService = {
  getAllWorkouts: async (): Promise<ApiResponse<WorkoutResponse[]>> => {
    const response = await api.get(WORKOUT_URL);
    return response.data;
  },

  getWorkoutById: async (id: number): Promise<ApiResponse<WorkoutResponse>> => {
    const response = await api.get(`${WORKOUT_URL}/${id}`);
    return response.data;
  },

  getUserWorkouts: async (): Promise<ApiResponse<WorkoutResponse[]>> => {
    const response = await api.get(`${WORKOUT_URL}/my`);
    return response.data;
  },

  createWorkout: async (data: WorkoutRequest): Promise<ApiResponse<WorkoutResponse>> => {
    const response = await api.post(WORKOUT_URL, data);
    return response.data;
  },

  updateWorkout: async (id: number, data: WorkoutRequest): Promise<ApiResponse<WorkoutResponse>> => {
    const response = await api.put(`${WORKOUT_URL}/${id}`, data);
    return response.data;
  },

  deleteWorkout: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${WORKOUT_URL}/${id}`);
    return response.data;
  },
};

export default workoutService;
