import api from './axiosConfig';
import { ApiResponse } from '../types/AppTypes';

const FILE_URL = '/files';

export const fileService = {
  uploadFile: async (file: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`${FILE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFile: async (fileName: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`${FILE_URL}/${fileName}`);
    return response.data;
  },
};

export default fileService;
