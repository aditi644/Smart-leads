import apiClient from './client';
import { ApiResponse, Lead, LeadFilters, LeadForm, LeadStats } from '../types';

export interface LeadsResponse {
  leads: Lead[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const leadsApi = {
  getLeads: async (filters: Partial<LeadFilters>): Promise<LeadsResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.append(key, String(val));
    });
    const res = await apiClient.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return { leads: res.data.data!, meta: res.data.meta! };
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data!;
  },

  createLead: async (data: LeadForm): Promise<Lead> => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', data);
    return res.data.data!;
  },

  updateLead: async (id: string, data: Partial<LeadForm>): Promise<Lead> => {
    const res = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data.data!;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStats> => {
    const res = await apiClient.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data.data!;
  },

  exportCSV: async (filters: Partial<LeadFilters>): Promise<void> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.append(key, String(val));
    });
    const res = await apiClient.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads-export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
