import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/client';
import { ADMIN_NAV } from './nav';

// Admin dashboard is an operational tool — prioritize queues and status, not
// a wall of colorful KPI cards (Design_Rules.md Rule 24).
export default function AdminOverview() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/admin/campaigns', { params: { status: 'submitted', limit: 1 } }),
      api.get('/admin/campaigns', { params: { status: 'under_review', limit: 1 } }),
      api.get('/admin/campaigns', { params: { status: 'active', limit: 1 } }),
      api.get('/admin/beneficiaries', { params: { status: 'pending' } }),
    ]).then(([submitted, review, active, beneficiaries]) => {
      setCounts({
        awaitingReview: submitted.data.total + review.data.total,
        active: active.data.total,
        pendingVerification: beneficiaries.data.length,
      });
    });
  }, []);

  return (
    <DashboardLayout title="Admin" nav={ADMIN_NAV}>
      <div className="flex flex-col gap-2xl">
        <h1 className="text-[24px] font-bold text-text-primary">Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
          <Link to="/admin/campaigns?status=submitted" className="bg-surface border border-border rounded-lg p-lg hover:border-primary/40 transition-colors">
            <p className="text-[13px] text-text-secondary">Campaigns awaiting review</p>
            <p className="text-[28px] font-bold text-text-primary">{counts ? counts.awaitingReview : '—'}</p>
          </Link>
          <Link to="/admin/verification" className="bg-surface border border-border rounded-lg p-lg hover:border-primary/40 transition-colors">
            <p className="text-[13px] text-text-secondary">Beneficiaries pending verification</p>
            <p className="text-[28px] font-bold text-text-primary">{counts ? counts.pendingVerification : '—'}</p>
          </Link>
          <Link to="/admin/campaigns?status=active" className="bg-surface border border-border rounded-lg p-lg hover:border-primary/40 transition-colors">
            <p className="text-[13px] text-text-secondary">Active campaigns</p>
            <p className="text-[28px] font-bold text-text-primary">{counts ? counts.active : '—'}</p>
          </Link>
        </div>

        <p className="text-[13px] text-text-secondary bg-background border border-border rounded-lg p-lg">
          Fraud queue, financial ledger totals, and payment success-rate metrics are not tracked yet —
          see the Fraud &amp; Risk and Support sections for their current (sample) state.
        </p>
      </div>
    </DashboardLayout>
  );
}
