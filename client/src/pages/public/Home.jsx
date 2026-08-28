import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import CampaignCard from '../../components/CampaignCard';
import Button from '../../components/Button';
import StartFundraiserLink from '../../components/StartFundraiserLink';
import api from '../../api/client';
import { CATEGORY_ICONS } from './categoryIcons';

const HOW_IT_WORKS = [
  { icon: 'edit_note', title: 'Create your campaign', text: 'Share your story and set a goal in Somali or English.' },
  { icon: 'gpp_good', title: 'Get verified', text: 'We confirm the organizer and beneficiary before it goes live.' },
  { icon: 'volunteer_activism', title: 'Receive support', text: 'Donors give by mobile money or card, and follow your progress.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/campaigns', { params: { limit: 6 } }),
      api.get('/campaigns/stats'),
    ])
      .then(([campaignsRes, statsRes]) => {
        setCampaigns(campaignsRes.data.items);
        setStats(statsRes.data);
      })
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(searchTerm ? `/explore?q=${encodeURIComponent(searchTerm)}` : '/explore');
  }

  return (
    <PageLayout>
      {/* Hero — headline + immediate search, the primary donor task (find a cause) */}
      <section className="bg-primary">
        <div className="max-w-container mx-auto px-xl py-4xl md:py-6xl flex flex-col items-center text-center gap-lg">
          <h1 className="text-[32px] md:text-[48px] font-bold text-white leading-tight max-w-2xl">
            Kaalmo is the trusted way for Somalis to raise and give money
          </h1>
          <p className="text-[16px] md:text-[18px] text-white/85 max-w-xl">
            Verified organizers, mobile money and card donations, and real updates — built for how
            Somalia actually gives.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-xl flex flex-col sm:flex-row gap-sm mt-md">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-text-secondary">
                search
              </span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="What are you raising money for?"
                className="w-full h-[52px] pl-4xl pr-lg rounded bg-white text-text-primary outline-none placeholder:text-text-secondary"
              />
            </div>
            <Button type="submit" variant="accent" className="h-[52px] px-2xl">
              Search
            </Button>
          </form>

          <StartFundraiserLink className="text-[14px] text-white/90 hover:text-white underline underline-offset-2 mt-xs">
            Or start your own fundraiser
          </StartFundraiserLink>
        </div>
      </section>

      {/* Trust stats — real, derivable numbers only (Rule 43); no invented totals */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-container mx-auto px-xl py-xl grid grid-cols-1 sm:grid-cols-3 gap-lg text-center">
          <div>
            <p className="text-[28px] font-bold text-primary">
              {stats ? `$${stats.totalRaised.toLocaleString()}` : '—'}
            </p>
            <p className="text-[13px] text-text-secondary">Raised through Kaalmo campaigns</p>
          </div>
          <div>
            <p className="text-[28px] font-bold text-primary">{stats ? stats.campaignCount : '—'}</p>
            <p className="text-[13px] text-text-secondary">Active and completed campaigns</p>
          </div>
          <div>
            <p className="text-[28px] font-bold text-primary">{stats ? stats.donorCount : '—'}</p>
            <p className="text-[13px] text-text-secondary">People who have donated</p>
          </div>
        </div>
      </section>

      {/* Category tiles — quick entry into Explore by cause */}
      <section className="max-w-container mx-auto px-xl py-3xl">
        <h2 className="text-[22px] font-semibold text-text-primary mb-lg">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
          {CATEGORY_ICONS.map((c) => (
            <Link
              key={c.label}
              to={`/explore?category=${encodeURIComponent(c.label)}`}
              className="flex flex-col items-center gap-sm p-lg rounded-lg border border-border bg-surface hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
                {c.icon}
              </span>
              <span className="text-[13px] font-medium text-text-primary text-center">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Campaigns to support */}
      <section className="max-w-container mx-auto px-xl py-3xl border-t border-border">
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-[22px] font-semibold text-text-primary">Campaigns to support</h2>
          <Link to="/explore" className="text-[14px] text-primary hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-surface border border-border rounded-lg animate-pulse" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-text-secondary text-[14px]">
            No active campaigns yet. Once a campaign is published, it will appear here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {campaigns.map((c) => (
              <CampaignCard key={c._id} campaign={c} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-container mx-auto px-xl py-3xl">
          <h2 className="text-[22px] font-semibold text-text-primary mb-2xl text-center">How Kaalmo works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2xl">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-sm">
                <span className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 26 }}>
                    {step.icon}
                  </span>
                </span>
                <h3 className="text-[16px] font-semibold text-text-primary">{step.title}</h3>
                <p className="text-[14px] text-text-secondary max-w-xs">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-container mx-auto px-xl py-4xl text-center flex flex-col items-center gap-lg">
        <h2 className="text-[24px] font-bold text-text-primary max-w-lg">
          Something to raise? Start your fundraiser today.
        </h2>
        <StartFundraiserLink>
          <Button className="px-2xl">Start a fundraiser</Button>
        </StartFundraiserLink>
      </section>
    </PageLayout>
  );
}
