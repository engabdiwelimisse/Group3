import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';

const PRESETS = [25, 50, 100, 250];

export default function Donate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    api
      .get(`/campaigns/${id}`)
      .then(({ data }) => setCampaign(data))
      .catch(() => setLoadError(true));
  }, [id]);

  const finalAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post(`/campaigns/${id}/donate`, {
        amount: finalAmount,
        message: message || undefined,
        isAnonymous,
      });
      navigate(`/donate/${id}/confirmed`, { state: { donation: data.donation, campaignTitle: campaign?.title } });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'We could not process this donation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <PageLayout>
        <div className="max-w-container mx-auto px-xl py-4xl">
          <EmptyState icon="error" title="Campaign not found or unavailable" description="This campaign may have been removed." />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout noFooter>
      <div className="max-w-[520px] mx-auto px-xl py-3xl flex flex-col gap-xl">
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">Donate</h1>
          {campaign && (
            <p className="text-[14px] text-text-secondary mt-xs">
              To: {campaign.title?.en || campaign.title?.so}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-xl bg-surface border border-border rounded-lg p-xl">
          {/* Financial clarity — amount and currency always visible (Rule 16) */}
          <div>
            <label className="text-[14px] font-medium text-text-primary block mb-md">Amount (USD)</label>
            <div className="grid grid-cols-4 gap-sm mb-md">
              {PRESETS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    setAmount(p);
                    setCustomAmount('');
                  }}
                  className={`h-[44px] rounded border text-[14px] font-medium transition-colors ${
                    !customAmount && amount === p
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-secondary hover:border-primary/50'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              placeholder="Enter a custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full h-[44px] px-lg rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-sm">
            <label className="text-[14px] font-medium text-text-primary">Message (optional)</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support"
              className="w-full px-lg py-md rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary transition-colors"
            />
          </div>

          {/* No preselected/unwanted defaults — checkbox starts unchecked (Rule 46) */}
          <label className="flex items-center gap-sm text-[14px] text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="text-primary focus:ring-primary rounded"
            />
            Donate anonymously (your name will not be shown publicly)
          </label>

          <div className="flex items-center justify-between pt-lg border-t border-border">
            <span className="text-[14px] text-text-secondary">Total</span>
            <span className="text-[20px] font-bold text-text-primary">${finalAmount || 0}</span>
          </div>

          {error && <p className="text-[13px] text-error bg-error/10 border border-error/30 rounded p-md">{error}</p>}

          <Button type="submit" disabled={submitting || !finalAmount} className="w-full">
            {submitting ? 'Processing…' : `Donate $${finalAmount || 0}`}
          </Button>

          <p className="text-[12px] text-text-secondary text-center">
            <Link to={`/campaigns/${id}`} className="hover:underline">Back to campaign</Link>
          </p>
        </form>
      </div>
    </PageLayout>
  );
}
