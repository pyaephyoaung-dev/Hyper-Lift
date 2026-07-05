import api from './axiosConfig';
import { DashboardStats, AdminDashboardStats, ApiResponse } from '../types/AppTypes';

const DASHBOARD_URL = '/dashboard';

export const dashboardService = {
  getUserDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get(`${DASHBOARD_URL}/user`);
    return response.data;
  },

  getAdminDashboard: async (): Promise<ApiResponse<AdminDashboardStats>> => {
    const response = await api.get(`${DASHBOARD_URL}/admin`);
    return response.data;
  },
};

export default dashboardService;
