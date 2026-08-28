import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusPill from '../../components/StatusPill';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../api/client';

import { ORGANIZER_NAV } from './nav';

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [payoutAccounts, setPayoutAccounts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState({ campaignId: '', amount: '', payoutAccountId: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function loadAll() {
    Promise.all([api.get('/withdrawals/mine'), api.get('/campaigns/mine'), api.get('/payout-accounts/mine')])
      .then(([w, c, p]) => {
        setWithdrawals(w.data);
        setCampaigns(c.data);
        setPayoutAccounts(p.data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(loadAll, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/withdrawals', {
        campaignId: form.campaignId,
        amount: Number(form.amount),
        payoutAccountId: form.payoutAccountId,
      });
      setForm({ campaignId: '', amount: '', payoutAccountId: '' });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not submit this withdrawal request.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Organizer" nav={ORGANIZER_NAV}>
      <div className="flex flex-col gap-2xl">
        <h1 className="text-[24px] font-bold text-text-primary">Withdrawals</h1>

        <div className="bg-surface border border-border rounded-lg p-xl">
          <h2 className="text-[16px] font-semibold text-text-primary mb-lg">Request a withdrawal</h2>

          {payoutAccounts.length === 0 && status === 'ready' && (
            <p className="text-[13px] text-text-secondary bg-background border border-border rounded p-md mb-lg">
              You don't have a payout account yet. Add a mobile money or bank account from Settings before
              requesting a withdrawal.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-lg max-w-md">
            <div className="flex flex-col gap-sm">
              <label className="text-[14px] font-medium text-text-primary">Campaign</label>
              <select
                required
                value={form.campaignId}
                onChange={(e) => setForm({ ...form, campaignId: e.target.value })}
                className="w-full h-[44px] px-lg rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary"
              >
                <option value="">Select a campaign</option>
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>{c.title?.en || c.title?.so} (${c.raisedAmount} raised)</option>
                ))}
              </select>
            </div>

            <Input
              label="Amount (USD)"
              type="number"
              min="1"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <div className="flex flex-col gap-sm">
              <label className="text-[14px] font-medium text-text-primary">Payout account</label>
              <select
                required
                value={form.payoutAccountId}
                onChange={(e) => setForm({ ...form, payoutAccountId: e.target.value })}
                className="w-full h-[44px] px-lg rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary"
              >
                <option value="">Select a payout account</option>
                {payoutAccounts.map((p) => (
                  <option key={p._id} value={p._id}>{p.providerName} — {p.accountNumberMasked}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-[13px] text-error bg-error/10 border border-error/30 rounded p-md">{error}</p>}

            <Button type="submit" disabled={submitting || payoutAccounts.length === 0} className="self-start">
              {submitting ? 'Submitting…' : 'Request withdrawal'}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-[16px] font-semibold text-text-primary mb-md">Withdrawal history</h2>
          {status === 'ready' && withdrawals.length === 0 && (
            <EmptyState
              icon="account_balance_wallet"
              title="No withdrawal requests yet"
              description="Once you request a withdrawal, it will appear here with its review status."
            />
          )}
          {withdrawals.length > 0 && (
            <div className="flex flex-col divide-y divide-border border-t border-b border-border">
              {withdrawals.map((w) => (
                <div key={w._id} className="flex items-center justify-between py-lg">
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">${w.amount.toLocaleString()}</p>
                    <p className="text-[13px] text-text-secondary">{new Date(w.createdAt).toLocaleDateString()}</p>
                  </div>
                  <StatusPill status={w.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
