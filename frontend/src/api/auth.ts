import apiClient from './client';
import { ApiResponse, AuthResponse, LoginForm, RegisterForm, User } from '../types';

export const authApi = {
  register: async (data: RegisterForm): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data!;
  },

  login: async (data: LoginForm): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data!;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data!;
  },

  getAllUsers: async (): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/auth/users');
    return res.data.data!;
  },
};
