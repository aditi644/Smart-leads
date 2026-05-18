import { useState } from 'react';
import { Spinner } from '../ui';
import { Lead, LeadForm, LeadSource, LeadStatus } from '../../types';

interface LeadFormProps {
  initial?: Lead;
  onSubmit: (data: LeadForm) => Promise<void>;
  onCancel: () => void;
}

const defaultForm: LeadForm = {
  name: '',
  email: '',
  status: LeadStatus.NEW,
  source: LeadSource.WEBSITE,
  notes: '',
};

export const LeadFormComponent = ({ initial, onSubmit, onCancel }: LeadFormProps) => {
  const [form, setForm] = useState<LeadForm>(
    initial
      ? {
          name: initial.name,
          email: initial.email,
          status: initial.status,
          source: initial.source,
          notes: initial.notes || '',
        }
      : defaultForm
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadForm, string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      newErrors.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = 'Please enter a valid email';
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LeadForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          className="input-field"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="rahul@example.com"
          className="input-field"
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Status & Source */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Source <span className="text-red-400">*</span>
          </label>
          <select name="source" value={form.source} onChange={handleChange} className="input-field">
            {Object.values(LeadSource).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.source && <p className="text-red-400 text-xs mt-1">{errors.source}</p>}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional notes..."
          className="input-field resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={loading}>
          {loading && <Spinner size="sm" />}
          {initial ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};
