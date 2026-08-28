import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatusPill from '../../components/StatusPill';
import ProgressBar from '../../components/ProgressBar';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import api from '../../api/client';

import { ORGANIZER_NAV } from './nav';

// Organizer dashboard answers "what do I need to do next?" — not a wall of
// colorful KPI cards (Design_Rules.md Rule 23).
export default function OrganizerDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api
      .get('/campaigns/mine')
      .then(({ data }) => {
        setCampaigns(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <DashboardLayout title="Organizer" nav={ORGANIZER_NAV}>
      <div className="flex flex-col gap-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold text-text-primary">My campaigns</h1>
          <Link to="/organizer/new/basics">
            <Button>Create campaign</Button>
          </Link>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col gap-sm">
            {[1, 2].map((i) => <div key={i} className="h-24 bg-surface border border-border rounded-lg animate-pulse" />)}
          </div>
        )}

        {status === 'error' && (
          <EmptyState icon="wifi_off" title="Couldn't load your campaigns" description="Please check your connection and try again." />
        )}

        {status === 'ready' && campaigns.length === 0 && (
          <EmptyState
            icon="campaign"
            title="No campaigns yet"
            description="Create your first campaign to start raising funds."
            action={<Link to="/organizer/new/basics"><Button>Create campaign</Button></Link>}
          />
        )}

        {status === 'ready' && campaigns.length > 0 && (
          <div className="flex flex-col gap-lg">
            {campaigns.map((c) => (
              <div key={c._id} className="bg-surface border border-border rounded-lg p-lg flex flex-col gap-md">
                <div className="flex items-start justify-between gap-md">
                  <div>
                    <h3 className="text-[16px] font-semibold text-text-primary">{c.title?.en || c.title?.so}</h3>
                    <p className="text-[13px] text-text-secondary">{c.category}</p>
                  </div>
                  <StatusPill status={c.status} />
                </div>
                <ProgressBar raised={c.raisedAmount} goal={c.goalAmount} />
                <div className="flex gap-md pt-sm border-t border-border">
                  <Link to={`/campaigns/${c._id}`} className="text-[13px] text-primary hover:underline">
                    View public page
                  </Link>
                  {c.status === 'draft' && (
                    <Link to={`/organizer/new/story?id=${c._id}`} className="text-[13px] text-primary hover:underline">
                      Continue editing
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
