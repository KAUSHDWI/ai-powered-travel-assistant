import React, { useState } from 'react';
import { Search, Filter, Calendar, X, Download } from 'lucide-react';
import { Button } from '../ui/button.js';
import { Input } from '../ui/input.js';

interface LeadFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    confidence?: 'Low' | 'Medium' | 'High';
    startDate?: string;
    endDate?: string;
  }) => void;
  onExport: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({ onFilterChange, onExport }) => {
  const [search, setSearch] = useState('');
  const [confidence, setConfidence] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    onFilterChange({
      search: search.trim() || undefined,
      confidence: (confidence as any) || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    });
  };

  const handleClear = () => {
    setSearch('');
    setConfidence('');
    setStartDate('');
    setEndDate('');
    onFilterChange({});
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
          <Filter className="h-4.5 w-4.5 text-primary" />
          <span>Leads Manager</span>
        </h4>

        {/* CSV export action */}
        <Button
          onClick={onExport}
          variant="outline"
          size="sm"
          className="rounded-xl h-9.5 cursor-pointer flex items-center gap-1.5 align-self-start md:align-self-auto shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search name, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>

        {/* Confidence Filter dropdown */}
        <select
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All Confidence Levels</option>
          <option value="High">High Confidence</option>
          <option value="Medium">Medium Confidence</option>
          <option value="Low">Low Confidence</option>
        </select>

        {/* Date Ranges */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 text-xs px-2.5"
            />
          </div>
          <span className="text-slate-400 text-xs">to</span>
          <div className="relative flex-1">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 text-xs px-2.5"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleApply}
            className="flex-1 h-10 text-xs rounded-xl cursor-pointer"
          >
            Apply Filters
          </Button>
          {(search || confidence || startDate || endDate) && (
            <Button
              onClick={handleClear}
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl cursor-pointer border-slate-200"
              aria-label="Clear filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default LeadFilters;
