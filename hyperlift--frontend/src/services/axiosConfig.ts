import axios from 'axios';
import { API_BASE_URL } from '../utils/AppConstants';
import { removeUser } from '../utils/Helpers';

const api = axios.create({
  baseURL: API_BASE_URL,
  // Auth is session-cookie based (JSESSIONID) — the backend needs the
  // cookie sent on every request, and the browser needs to accept the
  // Set-Cookie from the login response.
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
