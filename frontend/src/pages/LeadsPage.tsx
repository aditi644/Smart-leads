import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { leadsApi } from '../api/leads';
import { Lead, LeadForm } from '../types';
import { LeadsTable } from '../components/leads/LeadsTable';
import { LeadFiltersBar } from '../components/leads/LeadFilters';
import { Pagination } from '../components/leads/Pagination';
import { LeadFormComponent } from '../components/leads/LeadForm';
import { LeadDetailModal } from '../components/leads/LeadDetailModal';
import {
  Modal,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  TableSkeleton,
} from '../components/ui';

export const LeadsPage = () => {
  const { leads, meta, loading, error, filters, updateFilter, resetFilters, refetch } =
    useLeads();

  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCreate = async (data: LeadForm) => {
    try {
      await leadsApi.createLead(data);
      toast.success('Lead created successfully!');
      setCreateOpen(false);
      refetch();
    } catch {
      toast.error('Failed to create lead.');
    }
  };

  const handleUpdate = async (data: LeadForm) => {
    if (!editLead) return;
    try {
      await leadsApi.updateLead(editLead._id, data);
      toast.success('Lead updated!');
      setEditLead(null);
      refetch();
    } catch {
      toast.error('Failed to update lead.');
    }
  };

  const handleDelete = async () => {
    if (!deleteLead) return;
    setDeleteLoading(true);
    try {
      await leadsApi.deleteLead(deleteLead._id);
      toast.success('Lead deleted.');
      setDeleteLead(null);
      refetch();
    } catch {
      toast.error('Failed to delete lead.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await leadsApi.exportCSV(filters);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Leads</h1>
          {meta && (
            <p className="text-gray-500 text-sm mt-0.5">
              {meta.totalRecords} lead{meta.totalRecords !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        onExport={handleExport}
        exporting={exporting}
      />

      {/* Table Card */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters or add your first lead."
            action={
              <button onClick={() => setCreateOpen(true)} className="btn-primary">
                Add Lead
              </button>
            }
          />
        ) : (
          <>
            <LeadsTable
              leads={leads}
              onEdit={setEditLead}
              onDelete={setDeleteLead}
              onView={setViewLead}
            />
            {meta && (
              <div className="px-4 pb-4">
                <Pagination
                  currentPage={meta.currentPage}
                  totalPages={meta.totalPages}
                  totalRecords={meta.totalRecords}
                  limit={meta.limit}
                  onPageChange={(page) => updateFilter('page', page)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add New Lead">
        <LeadFormComponent onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        <LeadFormComponent
          initial={editLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditLead(null)}
        />
      </Modal>

      {/* View Modal */}
      <LeadDetailModal lead={viewLead} onClose={() => setViewLead(null)} />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteLead?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};
