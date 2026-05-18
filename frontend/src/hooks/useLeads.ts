import { useState, useEffect, useCallback } from 'react';
import { leadsApi, LeadsResponse } from '../api/leads';
import { LeadFilters } from '../types';
import { useDebounce } from './useDebounce';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: 'latest',
};

export function useLeads() {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await leadsApi.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      setData(result);
    } catch {
      setError('Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilter = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (value as number),
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    leads: data?.leads ?? [],
    meta: data?.meta,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refetch: fetchLeads,
  };
}
