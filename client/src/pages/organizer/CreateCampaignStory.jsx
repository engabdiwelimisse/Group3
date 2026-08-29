import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import WizardSteps from '../../components/WizardSteps';
import Button from '../../components/Button';
import api from '../../api/client';

const STEPS = ['Basics', 'Story', 'Review & Submit'];

export default function CreateCampaignStory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('id');
  const [story, setStory] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.patch(`/campaigns/${campaignId}`, { story: { so: story } });
      navigate(`/organizer/new/review?id=${campaignId}`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not save your story. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!campaignId) {
    return (
      <PageLayout noFooter>
        <div className="max-w-[560px] mx-auto px-xl py-3xl">
          <p className="text-[14px] text-error">Missing campaign. Please start from the basics step.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout noFooter>
      <div className="max-w-[560px] mx-auto px-xl py-3xl">
        <WizardSteps steps={STEPS} current={2} />
        <h1 className="text-[24px] font-bold text-text-primary mb-xs">Tell the full story</h1>
        <p className="text-[14px] text-text-secondary mb-2xl">
          Explain who needs help, why, and how the money will be used. Donors trust specific, honest stories.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <textarea
            rows={10}
            required
            minLength={20}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Start with who this is for and why the funds are needed..."
            className="w-full px-lg py-md rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary transition-colors"
          />

          {error && <p className="text-[13px] text-error bg-error/10 border border-error/30 rounded p-md">{error}</p>}

          <div className="flex justify-end pt-md">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Continue to review'}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
