import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProgressBar from '../../components/ProgressBar';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';

import { ORGANIZER_NAV } from './nav';

// Only real, derivable numbers are shown here. Views, conversion rate, and
// referral-source breakdown need analytics tracking that doesn't exist yet
// (see PROGRESS.md) — we say so rather than fabricate numbers (Rule 43).
export default function Analytics() {
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

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);

  return (
    <DashboardLayout title="Organizer" nav={ORGANIZER_NAV}>
      <div className="flex flex-col gap-xl">
        <h1 className="text-[24px] font-bold text-text-primary">Analytics</h1>

        {status === 'ready' && campaigns.length === 0 && (
          <EmptyState icon="monitoring" title="No campaigns to analyze yet" description="Create a campaign to see its performance here." />
        )}

        {campaigns.length > 0 && (
          <>
            <div className="bg-surface border border-border rounded-lg p-xl">
              <p className="text-[13px] text-text-secondary">Total raised across all campaigns</p>
              <p className="text-[28px] font-bold text-text-primary">${totalRaised.toLocaleString()}</p>
            </div>

            <div className="flex flex-col gap-lg">
              {campaigns.map((c) => (
                <div key={c._id} className="bg-surface border border-border rounded-lg p-lg flex flex-col gap-sm">
                  <h3 className="text-[15px] font-semibold text-text-primary">{c.title?.en || c.title?.so}</h3>
                  <ProgressBar raised={c.raisedAmount} goal={c.goalAmount} />
                </div>
              ))}
            </div>

            <p className="text-[13px] text-text-secondary bg-background border border-border rounded-lg p-lg">
              View counts, conversion rate, and referral-source breakdown are not tracked yet — this
              section will expand once analytics collection is added.
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
