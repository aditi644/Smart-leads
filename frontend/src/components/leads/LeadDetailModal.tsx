import { Lead } from '../../types';
import { Modal, StatusBadge, SourceBadge } from '../ui';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, onClose }: LeadDetailModalProps) => {
  if (!lead) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
      <div className="space-y-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 pb-4 border-b border-surface-600">
          <div className="w-12 h-12 rounded-full bg-brand-600/20 flex items-center justify-center">
            <span className="text-brand-400 font-bold text-lg">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{lead.name}</h3>
            <p className="text-gray-400 text-sm">{lead.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
            <StatusBadge status={lead.status} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Source</p>
            <SourceBadge source={lead.source} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created By</p>
            <p className="text-sm text-gray-300">
              {typeof lead.createdBy === 'object' ? lead.createdBy.name : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created At</p>
            <p className="text-sm text-gray-300">{formatDate(lead.createdAt)}</p>
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div className="bg-surface-700 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-sm text-gray-300">{lead.notes}</p>
          </div>
        )}

        <button onClick={onClose} className="btn-secondary w-full mt-2">
          Close
        </button>
      </div>
    </Modal>
  );
};
