import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, ArrowUpDown } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';
import { CONFIDENCE_COLORS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatters.js';
import type { Lead } from '../../types/index.js';

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
  onSortChange: (field: string) => void;
  currentSort: { sortBy: string; sortOrder: 'asc' | 'desc' };
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onDelete,
  onSortChange,
  currentSort,
}) => {
  const navigate = useNavigate();

  const getSortIcon = (field: string) => {
    if (currentSort.sortBy === field) {
      return (
        <span className="ml-1 text-primary">
          {currentSort.sortOrder === 'asc' ? '▲' : '▼'}
        </span>
      );
    }
    return <ArrowUpDown className="h-3 w-3 ml-1 text-slate-400 group-hover:text-slate-600 transition-colors" />;
  };

  const renderConfidenceBadge = (confidence: 'Low' | 'Medium' | 'High') => {
    const config = CONFIDENCE_COLORS[confidence] || CONFIDENCE_COLORS['Low'];
    return <Badge className={`${config.badge} border-none shadow-none`}>{confidence}</Badge>;
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200">
      {leads.length === 0 ? (
        <div className="p-12 text-center text-slate-500 font-medium space-y-2">
          <div className="text-3xl">📁</div>
          <p className="text-sm">No leads captured that match the current filters.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {/* Header Sort Toggles */}
              <TableHead>
                <button
                  onClick={() => onSortChange('customer.name')}
                  className="flex items-center hover:text-slate-800 font-semibold cursor-pointer group"
                >
                  Customer
                  {getSortIcon('customer.name')}
                </button>
              </TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Travel Date</TableHead>
              <TableHead>
                <button
                  onClick={() => onSortChange('qualification.leadScore')}
                  className="flex items-center hover:text-slate-800 font-semibold cursor-pointer group"
                >
                  Score
                  {getSortIcon('qualification.leadScore')}
                </button>
              </TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>
                <button
                  onClick={() => onSortChange('createdAt')}
                  className="flex items-center hover:text-slate-800 font-semibold cursor-pointer group"
                >
                  Captured Date
                  {getSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                {/* Customer Details */}
                <TableCell>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {lead.customer.name || <span className="italic font-light text-slate-400">Anonymous</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{lead.customer.phone || 'No phone'}</div>
                </TableCell>

                {/* Destination */}
                <TableCell className="font-medium text-slate-600 dark:text-slate-300">
                  {lead.travel.destination || <span className="italic font-light text-slate-400">TBD</span>}
                </TableCell>

                {/* Travel Date */}
                <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                  {lead.travel.travelDate || <span className="italic font-light text-slate-400">Not set</span>}
                </TableCell>

                {/* Lead Score */}
                <TableCell className="font-bold text-slate-700 dark:text-slate-300 font-display">
                  {lead.qualification.leadScore}
                </TableCell>

                {/* Confidence Level */}
                <TableCell>{renderConfidenceBadge(lead.qualification.confidence)}</TableCell>

                {/* Date Created */}
                <TableCell className="text-xs text-slate-500">{formatDate(lead.createdAt)}</TableCell>

                {/* Actions column */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/lead/${lead._id}`)}
                      className="h-8 w-8 rounded-lg cursor-pointer hover:bg-slate-100 hover:text-primary"
                      title="View Transcript"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(lead._id)}
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-destructive hover:bg-red-50"
                      title="Delete Lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
export default LeadsTable;
