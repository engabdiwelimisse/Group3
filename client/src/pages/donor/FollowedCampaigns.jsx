import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import CampaignCard from '../../components/CampaignCard';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import api from '../../api/client';
import { DONOR_NAV } from './nav';

export default function FollowedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api
      .get('/users/me/followed-campaigns')
      .then(({ data }) => {
        setCampaigns(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <DashboardLayout title="My account" nav={DONOR_NAV}>
      <div className="flex flex-col gap-xl">
        <h1 className="text-[24px] font-bold text-text-primary">Followed campaigns</h1>

        {status === 'loading' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {[1, 2].map((i) => <div key={i} className="h-72 bg-surface border border-border rounded-lg animate-pulse" />)}
          </div>
        )}

        {status === 'error' && (
          <EmptyState icon="wifi_off" title="Couldn't load followed campaigns" description="Please check your connection and try again." />
        )}

        {status === 'ready' && campaigns.length === 0 && (
          <EmptyState
            icon="notifications_active"
            title="You're not following any campaigns"
            description="Follow a campaign to get notified when the organizer posts an update."
            action={<Link to="/explore"><Button variant="secondary">Explore campaigns</Button></Link>}
          />
        )}

        {campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {campaigns.map((c) => <CampaignCard key={c._id} campaign={c} />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
