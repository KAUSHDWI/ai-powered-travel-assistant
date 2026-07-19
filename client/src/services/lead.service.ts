import api from './api.js';
import type { Lead, PaginatedResult, ApiResponse } from '../types/index.js';

export interface LeadFilters {
  page?: number;
  limit?: number;
  confidence?: 'Low' | 'Medium' | 'High';
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'qualification.leadScore';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export async function createLead(conversationId: string): Promise<ApiResponse<Lead>> {
  const response = await api.post<ApiResponse<Lead>>('/lead', { conversationId });
  return response.data;
}

export async function getLeadById(id: string): Promise<ApiResponse<Lead>> {
  const response = await api.get<ApiResponse<Lead>>(`/lead/${id}`);
  return response.data;
}

export async function getLeads(filters: LeadFilters = {}): Promise<ApiResponse<PaginatedResult<Lead>>> {
  const response = await api.get<ApiResponse<PaginatedResult<Lead>>>('/leads', {
    params: filters,
  });
  return response.data;
}

export async function deleteLead(id: string): Promise<ApiResponse<{ message: string }>> {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/lead/${id}`);
  return response.data;
}

export async function getConversationTranscript(id: string): Promise<ApiResponse<any>> {
  const response = await api.get<ApiResponse<any>>(`/conversations/${id}`);
  return response.data;
}

export async function downloadLeadsCSV(filters: Partial<LeadFilters> = {}): Promise<void> {
  const response = await api.get('/leads/export', {
    params: filters,
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `leads-export-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
