import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { ORGANIZER_NAV } from './nav';

// Co-organizers can help manage campaign content but not finances or the
// team itself — only the organizer sees this page (Design_Rules.md Rule 33).
export default function Team() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/campaigns/mine').then(({ data }) => {
      setCampaigns(data);
      if (data.length > 0) setSelectedId(data[0]._id);
    });
  }, []);

  function loadMembers(campaignId) {
    if (!campaignId) return;
    api.get(`/campaigns/${campaignId}/members`).then(({ data }) => setMembers(data));
  }

  useEffect(() => loadMembers(selectedId), [selectedId]);

  async function handleInvite(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/campaigns/${selectedId}/members`, { email });
      setEmail('');
      loadMembers(selectedId);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not send this invitation.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(memberId) {
    await api.delete(`/campaigns/${selectedId}/members/${memberId}`);
    loadMembers(selectedId);
  }

  if (campaigns.length === 0) {
    return (
      <DashboardLayout title="Organizer" nav={ORGANIZER_NAV}>
        <EmptyState icon="group" title="Create a campaign first" description="Once you have a campaign, you can invite co-organizers to help manage it." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Organizer" nav={ORGANIZER_NAV}>
      <div className="flex flex-col gap-xl max-w-lg">
        <h1 className="text-[24px] font-bold text-text-primary">Team</h1>

        <div className="flex flex-col gap-sm">
          <label className="text-[14px] font-medium text-text-primary">Campaign</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full h-[44px] px-lg rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary"
          >
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>{c.title?.en || c.title?.so}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleInvite} className="flex gap-sm items-end">
          <div className="flex-grow">
            <Input
              label="Invite a co-organizer by email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={submitting || !selectedId}>
            {submitting ? 'Sending…' : 'Invite'}
          </Button>
        </form>
        {error && <p className="text-[13px] text-error">{error}</p>}

        {members.length === 0 ? (
          <EmptyState icon="group" title="No team members yet" description="Invite someone by email to help manage this campaign's content." />
        ) : (
          <div className="flex flex-col divide-y divide-border border-t border-b border-border">
            {members.map((m) => (
              <div key={m._id} className="flex items-center justify-between py-lg">
                <div>
                  <p className="text-[14px] font-medium text-text-primary">{m.inviteEmail}</p>
                  <p className="text-[13px] text-text-secondary">Co-organizer</p>
                </div>
                <div className="flex items-center gap-md">
                  <StatusPill status={m.status} />
                  <Button variant="destructive" className="h-[32px] px-md text-[12px]" onClick={() => handleRemove(m._id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
