import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';

// Any user can receive a campaign invite (not just organizers) — reachable
// from the notification/email link, not gated to the organizer role.
export default function Invites() {
  const [invites, setInvites] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    api
      .get('/campaign-invites/mine')
      .then(({ data }) => {
        setInvites(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  async function accept(memberId) {
    await api.post(`/campaign-invites/${memberId}/accept`);
    load();
  }

  return (
    <PageLayout>
      <div className="max-w-[560px] mx-auto px-xl py-3xl flex flex-col gap-xl">
        <h1 className="text-[24px] font-bold text-text-primary">Campaign invitations</h1>

        {status === 'loading' && (
          <div className="flex flex-col gap-sm">{[1, 2].map((i) => <div key={i} className="h-16 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
        )}

        {status === 'error' && (
          <EmptyState icon="wifi_off" title="Couldn't load invitations" description="Please check your connection and try again." />
        )}

        {status === 'ready' && invites.length === 0 && (
          <EmptyState icon="group" title="No pending invitations" description="When an organizer invites you to help with a campaign, it will appear here." />
        )}

        {invites.length > 0 && (
          <div className="flex flex-col divide-y divide-border border-t border-b border-border">
            {invites.map((inv) => (
              <div key={inv._id} className="flex items-center justify-between py-lg gap-md">
                <div>
                  <p className="text-[14px] font-medium text-text-primary">
                    {inv.campaignId?.title?.en || inv.campaignId?.title?.so}
                  </p>
                  <p className="text-[13px] text-text-secondary">Invited by {inv.invitedBy?.fullName}</p>
                </div>
                <Button onClick={() => accept(inv._id)}>Accept</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
