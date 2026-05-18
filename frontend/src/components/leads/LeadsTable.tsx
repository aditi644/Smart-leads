import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead, UserRole } from '../../types';
import { StatusBadge, SourceBadge } from '../ui';
import { useAuthStore } from '../../store/authStore';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

export const LeadsTable = ({ leads, onEdit, onDelete, onView }: LeadsTableProps) => {
  const { user } = useAuthStore();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const canModify = (lead: Lead) =>
    user?.role === UserRole.ADMIN || lead.createdBy?.id === user?.id;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-600">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lead
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Created By
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Date
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-700">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-surface-750 transition-colors group"
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-400 font-semibold text-xs">
                      {lead.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-200 group-hover:text-white transition-colors">
                      {lead.name}
                    </p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="py-3.5 px-4">
                <SourceBadge source={lead.source} />
              </td>
              <td className="py-3.5 px-4 hidden md:table-cell">
                <span className="text-gray-400 text-xs">
                  {typeof lead.createdBy === 'object' ? lead.createdBy.name : '—'}
                </span>
              </td>
              <td className="py-3.5 px-4 hidden lg:table-cell">
                <span className="text-gray-500 text-xs">{formatDate(lead.createdAt)}</span>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(lead)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-gray-200 hover:bg-surface-600 transition-colors"
                    title="View details"
                  >
                    <Eye size={15} />
                  </button>
                  {canModify(lead) && (
                    <>
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-brand-400 hover:bg-brand-600/10 transition-colors"
                        title="Edit lead"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(lead)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
