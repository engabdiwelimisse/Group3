import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { ADMIN_NAV } from './nav';

const STATUSES = ['pending', 'confirmed', 'failed', 'refunded'];

// This is where the manual/admin-recorded payment provider actually gets
// used (spec Section 14) — an admin checks that money genuinely arrived
// (e.g. a mobile money or hawala reference) before confirming, since no real
// payment gateway is wired up yet. Financial actions always show amount,
// currency, method, and a confirmation step (Design_Rules.md Rule 16).
//
// Confirming one donation at a time doesn't scale to hundreds/thousands —
// selection + "Confirm N selected" lets an admin batch-confirm after
// reconciling a set of transfers at once (e.g. against a mobile money
// statement), without a modal per donation.
export default function AdminDonations() {
  const [status, setStatus] = useState('pending');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());

  const [confirmTarget, setConfirmTarget] = useState(null); // single donation, or 'batch'
  const [reference, setReference] = useState('');
  const [actionError, setActionError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [batchResult, setBatchResult] = useState(null);

  const confirmableDonations = donations.filter((d) => d.status === 'pending' && d.paymentId?.provider === 'manual');

  function load() {
    setLoading(true);
    setSelected(new Set());
    api
      .get('/admin/donations', { params: { status, limit: 100 } })
      .then(({ data }) => setDonations(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(load, [status]);

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === confirmableDonations.length ? new Set() : new Set(confirmableDonations.map((d) => d._id))
    );
  }

  async function handleConfirmSingle() {
    setSubmitting(true);
    setActionError(null);
    try {
      await api.post(`/admin/payments/${confirmTarget.paymentId._id}/confirm`, {
        providerTransactionId: reference || undefined,
      });
      setConfirmTarget(null);
      setReference('');
      load();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Could not confirm this payment.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmBatch() {
    setSubmitting(true);
    setActionError(null);
    try {
      const paymentIds = donations
        .filter((d) => selected.has(d._id))
        .map((d) => d.paymentId._id);
      const { data } = await api.post('/admin/payments/confirm-batch', { paymentIds });
      setBatchResult(data);
      load();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Could not confirm these payments.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Admin" nav={ADMIN_NAV}>
      <div className="flex flex-col gap-xl">
        <div className="flex items-center justify-between flex-wrap gap-md">
          <h1 className="text-[24px] font-bold text-text-primary">Donations</h1>
          <div className="flex gap-xs flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-md py-xs rounded text-[13px] border capitalize transition-colors ${
                  status === s ? 'bg-primary/10 text-primary border-primary' : 'border-border text-text-secondary hover:border-primary/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/30 rounded-lg px-lg py-md">
            <span className="text-[14px] text-text-primary">{selected.size} selected</span>
            <div className="flex gap-sm">
              <Button variant="tertiary" onClick={() => setSelected(new Set())}>Clear</Button>
              <Button onClick={() => { setConfirmTarget('batch'); setActionError(null); setBatchResult(null); }}>
                Confirm {selected.size} selected
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col gap-sm">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
        ) : donations.length === 0 ? (
          <EmptyState
            icon="volunteer_activism"
            title={status === 'pending' ? 'Nothing awaiting confirmation' : `No ${status} donations`}
            description={
              status === 'pending'
                ? 'Donations made through the manual payment method will appear here for you to confirm once the money arrives.'
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="text-left text-[12px] text-text-secondary uppercase border-b border-border">
                  <th className="py-sm pr-md w-8">
                    {confirmableDonations.length > 0 && (
                      <input
                        type="checkbox"
                        checked={selected.size === confirmableDonations.length}
                        onChange={toggleAll}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    )}
                  </th>
                  <th className="py-sm pr-md">Date</th>
                  <th className="py-sm pr-md">Campaign</th>
                  <th className="py-sm pr-md">Donor</th>
                  <th className="py-sm pr-md">Amount</th>
                  <th className="py-sm pr-md">Method</th>
                  <th className="py-sm pr-md">Status</th>
                  <th className="py-sm pr-md">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((d) => {
                  const canSelect = d.status === 'pending' && d.paymentId?.provider === 'manual';
                  return (
                    <tr key={d._id}>
                      <td className="py-md pr-md">
                        {canSelect && (
                          <input
                            type="checkbox"
                            checked={selected.has(d._id)}
                            onChange={() => toggleOne(d._id)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                        )}
                      </td>
                      <td className="py-md pr-md text-text-secondary whitespace-nowrap">{new Date(d.createdAt).toLocaleString()}</td>
                      <td className="py-md pr-md text-text-primary">{d.campaignId?.title?.en || d.campaignId?.title?.so || '—'}</td>
                      <td className="py-md pr-md text-text-secondary">
                        {d.isAnonymous ? 'Anonymous' : d.donorId?.fullName || d.donorId?.email || 'Guest'}
                      </td>
                      <td className="py-md pr-md text-text-primary font-semibold">${d.amount.toLocaleString()} {d.currency}</td>
                      <td className="py-md pr-md text-text-secondary capitalize">{d.paymentId?.provider || '—'}</td>
                      <td className="py-md pr-md"><StatusPill status={d.status} /></td>
                      <td className="py-md pr-md">
                        {canSelect && (
                          <Button
                            variant="secondary"
                            className="h-[32px] px-md text-[12px]"
                            onClick={() => { setConfirmTarget(d); setReference(''); setActionError(null); }}
                          >
                            Confirm
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmTarget === 'batch' && (
        <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center p-xl z-50">
          <div className="bg-surface rounded-lg border border-border p-xl max-w-md w-full flex flex-col gap-lg">
            {batchResult ? (
              <>
                <h3 className="text-[16px] font-semibold text-text-primary">Batch confirmation complete</h3>
                <p className="text-[14px] text-text-primary">
                  ✓ {batchResult.confirmedCount} confirmed
                  {batchResult.failedCount > 0 && <span className="text-error"> · {batchResult.failedCount} failed</span>}
                </p>
                {batchResult.failedCount > 0 && (
                  <div className="bg-error/10 border border-error/30 rounded p-md text-[13px] text-error max-h-40 overflow-y-auto">
                    {batchResult.results.filter((r) => !r.ok).map((r) => (
                      <p key={r.paymentId}>{r.error}</p>
                    ))}
                  </div>
                )}
                <Button onClick={() => { setConfirmTarget(null); setBatchResult(null); }}>Done</Button>
              </>
            ) : (
              <>
                <h3 className="text-[16px] font-semibold text-text-primary">Confirm {selected.size} donations?</h3>
                <p className="text-[13px] text-text-secondary">
                  Only confirm after verifying each transfer genuinely arrived (e.g. against a mobile money
                  statement). This updates the raised amount on every affected campaign immediately.
                </p>
                {actionError && <p className="text-[13px] text-error">{actionError}</p>}
                <div className="flex justify-end gap-md">
                  <Button variant="tertiary" onClick={() => setConfirmTarget(null)}>Cancel</Button>
                  <Button onClick={handleConfirmBatch} disabled={submitting}>
                    {submitting ? 'Confirming…' : `Confirm ${selected.size} donations`}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {confirmTarget && confirmTarget !== 'batch' && (
        <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center p-xl z-50">
          <div className="bg-surface rounded-lg border border-border p-xl max-w-md w-full flex flex-col gap-lg">
            <h3 className="text-[16px] font-semibold text-text-primary">Confirm this donation?</h3>

            <div className="bg-background border border-border rounded-lg p-lg flex flex-col gap-sm text-[14px]">
              <div className="flex justify-between"><span className="text-text-secondary">Amount</span><span className="font-semibold text-text-primary">${confirmTarget.amount.toLocaleString()} {confirmTarget.currency}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Campaign</span><span className="text-text-primary">{confirmTarget.campaignId?.title?.en || confirmTarget.campaignId?.title?.so}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Donor</span><span className="text-text-primary">{confirmTarget.isAnonymous ? 'Anonymous' : confirmTarget.donorId?.fullName || 'Guest'}</span></div>
            </div>

            <p className="text-[13px] text-text-secondary">
              Only confirm after verifying the money genuinely arrived (e.g. mobile money or hawala reference).
              This updates the campaign's raised amount immediately.
            </p>

            <div className="flex flex-col gap-sm">
              <label className="text-[14px] font-medium text-text-primary">Transaction reference (optional)</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. EVC Plus confirmation code"
                className="w-full h-[44px] px-lg rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary"
              />
            </div>

            {actionError && <p className="text-[13px] text-error">{actionError}</p>}

            <div className="flex justify-end gap-md">
              <Button variant="tertiary" onClick={() => setConfirmTarget(null)}>Cancel</Button>
              <Button onClick={handleConfirmSingle} disabled={submitting}>
                {submitting ? 'Confirming…' : 'Confirm payment'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
