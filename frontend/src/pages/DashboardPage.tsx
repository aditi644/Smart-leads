import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Target, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { leadsApi } from '../api/leads';
import { LeadStats, LeadStatus } from '../types';
import { Spinner } from '../components/ui';
import { useAuthStore } from '../store/authStore';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}

const StatCard = ({ label, value, icon, color, sub }: StatCardProps) => (
  <div className="card p-5 flex items-start gap-4">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    leadsApi.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const getStatusCount = (status: string) =>
    stats?.statusStats.find((s) => s._id === status)?.count ?? 0;

  const getSourceCount = (source: string) =>
    stats?.sourceStats.find((s) => s._id === source)?.count ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your leads</p>
        </div>
        <Link to="/leads" className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          New Lead
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={stats?.total ?? 0}
          icon={<Users size={18} className="text-brand-400" />}
          color="bg-brand-600/15"
        />
        <StatCard
          label="Qualified"
          value={getStatusCount(LeadStatus.QUALIFIED)}
          icon={<Target size={18} className="text-emerald-400" />}
          color="bg-emerald-500/15"
          sub="Ready to convert"
        />
        <StatCard
          label="Contacted"
          value={getStatusCount(LeadStatus.CONTACTED)}
          icon={<TrendingUp size={18} className="text-yellow-400" />}
          color="bg-yellow-500/15"
          sub="In progress"
        />
        <StatCard
          label="Lost"
          value={getStatusCount(LeadStatus.LOST)}
          icon={<AlertCircle size={18} className="text-red-400" />}
          color="bg-red-500/15"
          sub="Need review"
        />
      </div>

      {/* Two column: Status + Source breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-200 mb-4">By Status</h2>
          <div className="space-y-3">
            {Object.values(LeadStatus).map((status) => {
              const count = getStatusCount(status);
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              const colors: Record<LeadStatus, string> = {
                [LeadStatus.NEW]: 'bg-blue-500',
                [LeadStatus.CONTACTED]: 'bg-yellow-500',
                [LeadStatus.QUALIFIED]: 'bg-emerald-500',
                [LeadStatus.LOST]: 'bg-red-500',
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{status}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-200 mb-4">By Source</h2>
          <div className="space-y-3">
            {['Website', 'Instagram', 'Referral'].map((source) => {
              const count = getSourceCount(source);
              const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0;
              const colors: Record<string, string> = {
                Website: 'bg-purple-500',
                Instagram: 'bg-pink-500',
                Referral: 'bg-orange-500',
              };
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{source}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors[source]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <Link
        to="/leads"
        className="card p-4 flex items-center justify-between hover:bg-surface-750 transition-colors group"
      >
        <div>
          <p className="font-medium text-gray-200">View All Leads</p>
          <p className="text-sm text-gray-500">Filter, search and manage your pipeline</p>
        </div>
        <ArrowRight size={18} className="text-gray-500 group-hover:text-brand-400 transition-colors" />
      </Link>
    </div>
  );
};
