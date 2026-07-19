import React, { useEffect, useState } from 'react';
import { useLead } from '../hooks/useLead.js';
import { useAuth } from '../hooks/useAuth.js';
import AnalyticsCards from '../components/admin/AnalyticsCards.js';
import LeadFilters from '../components/admin/LeadFilters.js';
import LeadsTable from '../components/admin/LeadsTable.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog.js';
import { Button } from '../components/ui/button.js';
import { ChevronLeft, ChevronRight, LayoutDashboard, ShieldAlert } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { leadsData, loading, error, fetchLeads, removeLead, exportCSV } = useLead();
  const { user } = useAuth();

  const [filters, setFilters] = useState<any>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Sync leads from API when filters change
  useEffect(() => {
    fetchLeads(filters);
  }, [filters, fetchLeads]);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({
      ...prev,
      ...newFilters,
      page: 1, // reset page when filters change
    }));
  };

  const handleSortChange = (field: string) => {
    setFilters((prev: any) => {
      const isSame = prev.sortBy === field;
      const nextOrder = isSame && prev.sortOrder === 'desc' ? 'asc' : 'desc';
      return {
        ...prev,
        sortBy: field,
        sortOrder: nextOrder,
        page: 1,
      };
    });
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      const success = await removeLead(deleteId);
      if (success) {
        setConfirmOpen(false);
        setDeleteId(null);
        fetchLeads(filters); // refresh list
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev: any) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleExport = () => {
    // Export with same active filters (excluding pagination)
    const exportFilters = { ...filters };
    delete exportFilters.page;
    delete exportFilters.limit;
    exportCSV(exportFilters);
  };

  const leads = leadsData?.data || [];
  const pagination = leadsData?.pagination;

  return (
    <div className="flex-1 space-y-6">
      {/* Dashboard header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-display">
            Agent Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.email}. Review captured traveler leads and qualification scoring.
          </p>
        </div>
      </div>

      {/* Analytics Cards Row */}
      <AnalyticsCards leads={leads} />

      {/* Filter Options Panel */}
      <LeadFilters onFilterChange={handleFilterChange} onExport={handleExport} />

      {/* Leads Main Table view */}
      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center space-x-2">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 bg-card border border-border rounded-2xl shadow-sm">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground mt-3 font-semibold">Updating lead metrics...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <LeadsTable
            leads={leads}
            onDelete={handleDeleteRequest}
            onSortChange={handleSortChange}
            currentSort={{ sortBy: filters.sortBy, sortOrder: filters.sortOrder }}
          />

          {/* Table pagination navigation controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-slate-500">
                Showing page <strong className="font-semibold text-slate-700 dark:text-slate-300">{pagination.page}</strong> of{' '}
                <strong className="font-semibold text-slate-700 dark:text-slate-300">{pagination.totalPages}</strong> ({pagination.total} total)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="h-8.5 w-8.5 rounded-lg cursor-pointer border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className="h-8.5 w-8.5 rounded-lg cursor-pointer border-slate-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Lead verification Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent onClose={() => setConfirmOpen(false)} className="max-w-md">
          <DialogHeader>
            <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mb-3">
              <ShieldAlert className="h-5.5 w-5.5" />
            </div>
            <DialogTitle>Confirm Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action is permanent and will remove the lead records and transcript data from database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="secondary"
              onClick={() => setConfirmOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl cursor-pointer"
            >
              Delete Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AdminDashboard;
