import api from './axiosConfig';
import { ExerciseRequest, ExerciseResponse, ApiResponse } from '../types/AppTypes';

const EXERCISE_URL = '/exercises';

export const exerciseService = {
  getAllExercises: async (): Promise<ApiResponse<ExerciseResponse[]>> => {
    const response = await api.get(EXERCISE_URL);
    return response.data;
  },

  getExerciseById: async (id: number): Promise<ApiResponse<ExerciseResponse>> => {
    const response = await api.get(`${EXERCISE_URL}/${id}`);
    return response.data;
  },

  getExercisesByMuscleGroup: async (muscleGroup: string): Promise<ApiResponse<ExerciseResponse[]>> => {
    const response = await api.get(`${EXERCISE_URL}/muscle-group/${muscleGroup}`);
    return response.data;
  },

  createExercise: async (data: ExerciseRequest): Promise<ApiResponse<ExerciseResponse>> => {
    const response = await api.post(EXERCISE_URL, data);
    return response.data;
  },

  updateExercise: async (id: number, data: ExerciseRequest): Promise<ApiResponse<ExerciseResponse>> => {
    const response = await api.put(`${EXERCISE_URL}/${id}`, data);
    return response.data;
  },

  deleteExercise: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${EXERCISE_URL}/${id}`);
    return response.data;
  },
};

export default exerciseService;
