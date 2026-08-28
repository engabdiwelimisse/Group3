import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import ProgressBar from '../../components/ProgressBar';
import VerificationBadge from '../../components/VerificationBadge';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

// Campaign detail is a Trust + Understanding + Donation experience
// (Design_Rules.md Rule 22) — story and trust signals come before secondary
// features like comments; the donate panel stays clear and uncluttered.
export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [donations, setDonations] = useState([]);
  const [supporterCount, setSupporterCount] = useState(0);
  const [status, setStatus] = useState('loading');
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportError, setReportError] = useState(null);
  const [reportSent, setReportSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStatus('loading');
    Promise.all([
      api.get(`/campaigns/${id}`),
      api.get(`/campaigns/${id}/updates`),
      api.get(`/campaigns/${id}/donations`, { params: { limit: 10 } }),
    ])
      .then(([campaignRes, updatesRes, donationsRes]) => {
        setCampaign(campaignRes.data);
        setUpdates(updatesRes.data);
        setDonations(donationsRes.data.items);
        setSupporterCount(donationsRes.data.supporterCount);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));

    // Fetched separately: whether the viewer follows/has saved this
    // campaign is a nice-to-have for button state, not core page content —
    // an expired/invalid session here should never block the campaign
    // itself from displaying.
    if (user) {
      api
        .get(`/campaigns/${id}/interactions`)
        .then(({ data }) => {
          setFollowing(data.following);
          setSaved(data.saved);
        })
        .catch(() => {});
    }
  }, [id, user]);

  async function toggleFollow() {
    if (!user) return navigate('/login', { state: { from: `/campaigns/${id}` } });
    if (following) {
      await api.delete(`/campaigns/${id}/follow`);
      setFollowing(false);
    } else {
      await api.post(`/campaigns/${id}/follow`);
      setFollowing(true);
    }
  }

  async function toggleSave() {
    if (!user) return navigate('/login', { state: { from: `/campaigns/${id}` } });
    if (saved) {
      await api.delete(`/campaigns/${id}/save`);
      setSaved(false);
    } else {
      await api.post(`/campaigns/${id}/save`);
      setSaved(true);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleReport(e) {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: `/campaigns/${id}` } });
    setReportError(null);
    try {
      await api.post('/reports', { targetType: 'campaign', targetId: id, reason: reportReason });
      setReportSent(true);
    } catch (err) {
      setReportError(err.response?.data?.error?.message || 'Could not submit this report.');
    }
  }

  if (status === 'loading') {
    return (
      <PageLayout>
        <div className="max-w-container mx-auto px-xl py-2xl animate-pulse">
          <div className="h-80 bg-surface border border-border rounded-lg mb-xl" />
          <div className="h-6 w-2/3 bg-surface border border-border rounded mb-md" />
          <div className="h-4 w-1/3 bg-surface border border-border rounded" />
        </div>
      </PageLayout>
    );
  }

  if (status === 'error' || !campaign) {
    return (
      <PageLayout>
        <div className="max-w-container mx-auto px-xl py-4xl">
          <EmptyState
            icon="error"
            title="Campaign not found or unavailable"
            description="This campaign may have been removed, or the link is incorrect."
            action={
              <Link to="/explore">
                <Button variant="secondary">Back to Explore</Button>
              </Link>
            }
          />
        </div>
      </PageLayout>
    );
  }

  const title = campaign.title?.en || campaign.title?.so;
  const story = campaign.story?.en || campaign.story?.so;

  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-2xl grid grid-cols-1 lg:grid-cols-3 gap-2xl">
        {/* Primary column: trust + story */}
        <div className="lg:col-span-2 flex flex-col gap-xl">
          <div className="h-80 w-full rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
            {campaign.coverImageUrl ? (
              <img src={campaign.coverImageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-text-secondary" style={{ fontSize: 48 }}>image</span>
            )}
          </div>

          <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between gap-md">
              <span className="text-[13px] font-medium text-primary uppercase tracking-wide">{campaign.category}</span>
              <button
                onClick={toggleSave}
                className="flex items-center gap-xs text-[13px] text-text-secondary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}>
                  bookmark
                </span>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
            <h1 className="text-[28px] md:text-[32px] font-bold text-text-primary leading-tight">{title}</h1>
            <div className="flex flex-wrap gap-xs">
              {(campaign.verificationBadges || []).map((b) => (
                <VerificationBadge key={b} type={b} />
              ))}
            </div>
          </div>

          <div className="prose-none">
            <h2 className="text-[18px] font-semibold text-text-primary mb-sm">The story</h2>
            <p className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-line">{story}</p>
          </div>

          <div>
            <h2 className="text-[18px] font-semibold text-text-primary mb-md">
              Recent donations {supporterCount > 0 && <span className="text-text-secondary font-normal">({supporterCount})</span>}
            </h2>
            {donations.length === 0 ? (
              <EmptyState
                icon="volunteer_activism"
                title="No donations yet"
                description="Be the first to support this campaign."
              />
            ) : (
              <div className="flex flex-col divide-y divide-border border-t border-b border-border">
                {donations.map((d) => (
                  <div key={d._id} className="py-md flex items-start justify-between gap-md">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-text-primary">{d.donorName || 'Anonymous'}</p>
                      {d.message && <p className="text-[13px] text-text-secondary mt-xs truncate">{d.message}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[14px] font-semibold text-text-primary">${d.amount.toLocaleString()}</p>
                      <p className="text-[12px] text-text-secondary">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-md">
              <h2 className="text-[18px] font-semibold text-text-primary">Updates</h2>
              <button
                onClick={toggleFollow}
                className={`text-[13px] font-medium transition-colors ${following ? 'text-primary' : 'text-text-secondary hover:text-primary'}`}
              >
                {following ? '✓ Following' : 'Follow for updates'}
              </button>
            </div>
            {updates.length === 0 ? (
              <EmptyState
                icon="update"
                title="No updates yet"
                description="The organizer's next update will appear here so you can see how funds are being used."
              />
            ) : (
              <div className="flex flex-col gap-lg">
                {updates.map((u) => (
                  <div key={u._id} className="border-l-2 border-border pl-lg">
                    <p className="text-[13px] text-text-secondary mb-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[14px] text-text-primary">{u.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Donation panel — must remain clear, not competing with share/report (Rule 22) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-surface border border-border rounded-lg p-xl flex flex-col gap-lg">
            <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} />
            <p className="text-[13px] text-text-secondary">
              {supporterCount} {supporterCount === 1 ? 'supporter' : 'supporters'} · {campaign.region || 'Region not specified'}
            </p>

            <Link to={`/donate/${campaign._id}`}>
              <Button className="w-full">Donate to this campaign</Button>
            </Link>

            <div className="flex items-center justify-between pt-md border-t border-border">
              <button onClick={handleShare} className="flex items-center gap-xs text-[13px] text-text-secondary hover:text-primary transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>
                {copied ? 'Link copied' : 'Share'}
              </button>
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-xs text-[13px] text-text-secondary hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>flag</span>
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {reportOpen && (
        <div className="fixed inset-0 bg-text-primary/40 flex items-center justify-center p-xl z-50">
          <div className="bg-surface rounded-lg border border-border p-xl max-w-md w-full flex flex-col gap-lg">
            {reportSent ? (
              <>
                <h3 className="text-[16px] font-semibold text-text-primary">Report submitted</h3>
                <p className="text-[13px] text-text-secondary">Our Trust &amp; Safety team will review this campaign.</p>
                <Button variant="secondary" onClick={() => { setReportOpen(false); setReportSent(false); setReportReason(''); }}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-[16px] font-semibold text-text-primary">Report this campaign</h3>
                <p className="text-[13px] text-text-secondary">Tell us what looks wrong. Your report is reviewed by our team.</p>
                <form onSubmit={handleReport} className="flex flex-col gap-lg">
                  <textarea
                    rows={3}
                    required
                    minLength={5}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="What's the concern?"
                    className="w-full px-lg py-md rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary"
                  />
                  {reportError && <p className="text-[13px] text-error">{reportError}</p>}
                  <div className="flex justify-end gap-md">
                    <Button type="button" variant="tertiary" onClick={() => setReportOpen(false)}>Cancel</Button>
                    <Button type="submit" variant="destructive">Submit report</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}
