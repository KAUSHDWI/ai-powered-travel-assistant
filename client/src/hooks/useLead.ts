import { useState, useCallback } from 'react';
import * as leadService from '../services/lead.service.js';
import type { Lead, PaginatedResult } from '../types/index.js';

export function useLead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadsData, setLeadsData] = useState<PaginatedResult<Lead> | null>(null);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async (filters: leadService.LeadFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads(filters);
      if (response.success && response.data) {
        setLeadsData(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeadById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeadById(id);
      if (response.success && response.data) {
        setCurrentLead(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch lead details');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch lead details');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeLead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.deleteLead(id);
      if (response.success) {
        // Update local state if listing leads
        if (leadsData) {
          setLeadsData({
            ...leadsData,
            data: leadsData.data.filter((l) => l._id !== id),
            pagination: {
              ...leadsData.pagination,
              total: leadsData.pagination.total - 1,
            },
          });
        }
        return true;
      } else {
        setError(response.error?.message || 'Failed to delete lead');
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to delete lead');
      return false;
    } finally {
      setLoading(false);
    }
  }, [leadsData]);

  const exportCSV = useCallback(async (filters: Partial<leadService.LeadFilters> = {}) => {
    try {
      await leadService.downloadLeadsCSV(filters);
    } catch (err: any) {
      setError(err.message || 'Failed to download CSV');
    }
  }, []);

  return {
    loading,
    error,
    leadsData,
    currentLead,
    fetchLeads,
    fetchLeadById,
    removeLead,
    exportCSV,
  };
}
export default useLead;
