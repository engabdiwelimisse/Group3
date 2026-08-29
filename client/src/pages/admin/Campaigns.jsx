import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { ADMIN_NAV } from './nav';

const STATUSES = ['', 'submitted', 'under_review', 'approved', 'published', 'active', 'suspended', 'rejected'];

const ACTIONS_BY_STATUS = {
  submitted: [
    { action: 'approve', label: 'Approve campaign', variant: 'primary' },
    { action: 'start_review', label: 'Start review', variant: 'secondary' },
    { action: 'reject', label: 'Reject campaign', variant: 'destructive', reasonRequired: true },
  ],
  under_review: [{ action: 'approve', label: 'Approve campaign', variant: 'primary' }, { action: 'reject', label: 'Reject campaign', variant: 'destructive', reasonRequired: true }],
  approved: [{ action: 'publish', label: 'Publish campaign', variant: 'primary' }],
  published: [{ action: 'suspend', label: 'Suspend campaign', variant: 'destructive', reasonRequired: true }],
  active: [{ action: 'suspend', label: 'Suspend campaign', variant: 'destructive', reasonRequired: true }],
  suspended: [{ action: 'restore', label: 'Restore campaign', variant: 'secondary' }],
};

export default function AdminCampaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || '';
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasonPrompt, setReasonPrompt] = useState(null); // { campaignId, action }
  const [reasonText, setReasonText] = useState('');
  const [actionError, setActionError] = useState(null);

  function load() {
    setLoading(true);
    api
      .get('/admin/campaigns', { params: { status: status || undefined, limit: 50 } })
      .then(({ data }) => setCampaigns(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(load, [status]);

  async function runAction(campaignId, action, reason) {
    setActionError(null);
    try {
      await api.patch(`/admin/campaigns/${campaignId}/review`, { action, reason });
      setReasonPrompt(null);
      setReasonText('');
      load();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'This action could not be completed.');
    }
  }

  return (
    <DashboardLayout title="Admin" nav={ADMIN_NAV}>
      <div className="flex flex-col gap-xl">
        <div className="flex items-center justify-between flex-wrap gap-md">
          <h1 className="text-[24px] font-bold text-text-primary">Campaigns</h1>
          <div className="flex gap-xs flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setSearchParams(s ? { status: s } : {})}
                className={`px-md py-xs rounded text-[13px] border transition-colors ${
                  status === s ? 'bg-primary/10 text-primary border-primary' : 'border-border text-text-secondary hover:border-primary/40'
                }`}
              >
                {s ? s.replace(/_/g, ' ') : 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-sm">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-surface border border-border rounded-lg animate-pulse" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <EmptyState icon="campaign" title="No campaigns in this status" description="Try a different filter above." />
        ) : (
          <div className="flex flex-col divide-y divide-border border-t border-b border-border">
            {campaigns.map((c) => {
              const actions = ACTIONS_BY_STATUS[c.status] || [];
              return (
                <div key={c._id} className="flex items-center justify-between py-lg gap-md flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-text-primary truncate">{c.title?.en || c.title?.so}</p>
                    <p className="text-[13px] text-text-secondary">{c.category} · ${c.goalAmount.toLocaleString()} goal</p>
                  </div>
                  <div className="flex items-center gap-md">
                    <StatusPill status={c.status} />
                    {actions.map((a) => (
                      <Button
                        key={a.action}
                        variant={a.variant}
                        className="h-[36px] px-md text-[13px]"
                        onClick={() =>
                          a.reasonRequired
                            ? setReasonPrompt({ campaignId: c._id, action: a.action, label: a.label })
                            : runAction(c._id, a.action)
                        }
                      >
                        {a.label}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destructive actions require an explicit reason and confirmation (Rule 15/24) */}
      {reasonPrompt && (
        <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center p-xl z-50">
          <div className="bg-surface rounded-lg border border-border p-xl max-w-md w-full flex flex-col gap-lg">
            <h3 className="text-[16px] font-semibold text-text-primary">{reasonPrompt.label}</h3>
            <p className="text-[13px] text-text-secondary">
              This action is visible to the organizer. Please explain why, so they understand what to fix.
            </p>
            <textarea
              rows={3}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Reason (required)"
              className="w-full px-lg py-md rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary"
            />
            {actionError && <p className="text-[13px] text-error">{actionError}</p>}
            <div className="flex justify-end gap-md">
              <Button variant="tertiary" onClick={() => setReasonPrompt(null)}>Cancel</Button>
              <Button
                variant="destructive"
                disabled={reasonText.trim().length < 3}
                onClick={() => runAction(reasonPrompt.campaignId, reasonPrompt.action, reasonText)}
              >
                Confirm {reasonPrompt.label.toLowerCase()}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
