import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import WizardSteps from '../../components/WizardSteps';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import api from '../../api/client';

const STEPS = ['Basics', 'Story', 'Review & Submit'];

export default function CreateCampaignReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('id');
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    api.get(`/campaigns/${campaignId}`).then(({ data }) => setCampaign(data));
  }, [campaignId]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/campaigns/${campaignId}/submit`);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not submit your campaign. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <PageLayout noFooter>
        <div className="max-w-[520px] mx-auto px-xl py-4xl text-center flex flex-col items-center gap-lg">
          <span className="material-symbols-outlined text-success" style={{ fontSize: 48 }}>task_alt</span>
          <h1 className="text-[22px] font-bold text-text-primary">Campaign submitted for review</h1>
          <p className="text-[14px] text-text-secondary">
            Our team will review your campaign and beneficiary details. This usually takes 1–2 business days.
          </p>
          <Link to="/organizer"><Button>Go to my campaigns</Button></Link>
        </div>
      </PageLayout>
    );
  }

  if (!campaign) {
    return (
      <PageLayout noFooter>
        <div className="max-w-[560px] mx-auto px-xl py-3xl animate-pulse">
          <div className="h-40 bg-surface border border-border rounded-lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout noFooter>
      <div className="max-w-[560px] mx-auto px-xl py-3xl">
        <WizardSteps steps={STEPS} current={3} />
        <h1 className="text-[24px] font-bold text-text-primary mb-2xl">Review and submit</h1>

        <div className="bg-surface border border-border rounded-lg p-xl flex flex-col gap-lg mb-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-semibold text-text-primary">{campaign.title?.so}</h2>
              <p className="text-[13px] text-text-secondary">{campaign.category} · Goal ${campaign.goalAmount.toLocaleString()}</p>
            </div>
            <StatusPill status={campaign.status} />
          </div>
          <p className="text-[14px] text-text-secondary whitespace-pre-line">{campaign.story?.so}</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-lg mb-xl text-[13px] text-text-secondary">
          You can add a beneficiary, media, and additional verification documents after this campaign is
          approved, from your organizer dashboard. A withdrawal will require a verified beneficiary before
          it can be requested.
        </div>

        {error && <p className="text-[13px] text-error bg-error/10 border border-error/30 rounded p-md mb-lg">{error}</p>}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit for review'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
