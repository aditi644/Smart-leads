import { Search, X, Download } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus } from '../../types';
import { Spinner } from '../ui';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
  onExport: () => void;
  exporting: boolean;
}

export const LeadFiltersBar = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  exporting,
}: LeadFiltersProps) => {
  const hasActiveFilters =
    filters.status !== '' || filters.source !== '' || filters.search !== '';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Search name or email..."
          className="input-field pl-9"
        />
      </div>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
        className="input-field w-auto"
      >
        <option value="">All Statuses</option>
        {Object.values(LeadStatus).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Source */}
      <select
        value={filters.source}
        onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
        className="input-field w-auto"
      >
        <option value="">All Sources</option>
        {Object.values(LeadSource).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value as 'latest' | 'oldest')}
        className="input-field w-auto"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={14} />
          Clear
        </button>
      )}

      {/* Export */}
      <button
        onClick={onExport}
        disabled={exporting}
        className="btn-secondary flex items-center gap-2 text-sm"
      >
        {exporting ? <Spinner size="sm" /> : <Download size={15} />}
        Export CSV
      </button>
    </div>
  );
};
