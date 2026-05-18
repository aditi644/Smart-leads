import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { LeadStatus, LeadSource } from '../../types';

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <Loader2 className={clsx('animate-spin text-brand-400', sizes[size])} />;
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusColors: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  [LeadStatus.CONTACTED]: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  [LeadStatus.QUALIFIED]: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  [LeadStatus.LOST]: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
};

export const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span className={clsx('badge', statusColors[status])}>{status}</span>
);

// ─── Source Badge ─────────────────────────────────────────────────────────────

const sourceColors: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/30',
  [LeadSource.INSTAGRAM]: 'bg-pink-500/15 text-pink-400 ring-1 ring-pink-500/30',
  [LeadSource.REFERRAL]: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
};

export const SourceBadge = ({ source }: { source: LeadSource }) => (
  <span className={clsx('badge', sourceColors[source])}>{source}</span>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center mb-4">
      <span className="text-2xl">📭</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-200 mb-1">{title}</h3>
    <p className="text-gray-500 text-sm max-w-xs mb-4">{description}</p>
    {action}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
      <span className="text-2xl">⚠️</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-200 mb-1">Something went wrong</h3>
    <p className="text-gray-500 text-sm max-w-xs mb-4">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary text-sm">
        Try Again
      </button>
    )}
  </div>
);

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-surface-700">
        <div className="w-8 h-8 rounded-full bg-surface-600" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-surface-600 rounded w-1/3" />
          <div className="h-2.5 bg-surface-600 rounded w-1/4" />
        </div>
        <div className="h-6 w-16 bg-surface-600 rounded-full" />
        <div className="h-6 w-20 bg-surface-600 rounded-full" />
      </div>
    ))}
  </div>
);

// ─── Modal ─────────────────────────────────────────────────────────────────────

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-surface-800 border border-surface-600 rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-surface-600">
          <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-gray-400 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary" disabled={loading}>
        Cancel
      </button>
      <button onClick={onConfirm} className="btn-danger flex items-center gap-2" disabled={loading}>
        {loading && <Spinner size="sm" />}
        Delete
      </button>
    </div>
  </Modal>
);
