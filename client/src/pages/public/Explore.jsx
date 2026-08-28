import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import CampaignCard from '../../components/CampaignCard';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';

const CATEGORIES = ['Medical', 'Education', 'Emergency', 'Family', 'Funeral', 'Community', 'Mosque', 'School', 'Orphan Support', 'Disaster Relief', 'Business/Startup', 'NGO', 'Public Projects'];
const REGIONS = ['Mogadishu', 'Hargeisa', 'Puntland', 'Nairobi'];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = searchParams.get('category') || '';
  const region = searchParams.get('region') || '';
  const q = searchParams.get('q') || '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get('/campaigns', { params: { category: category || undefined, region: region || undefined, q: q || undefined, limit: 30 } })
      .then(({ data }) => setCampaigns(data.items))
      .catch(() => setError('We could not load campaigns right now. Please check your connection and try again.'))
      .finally(() => setLoading(false));
  }, [category, region, q]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-2xl flex flex-col md:flex-row gap-2xl">
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-lg">
          <div className="bg-surface rounded-lg border border-border p-lg">
            <h3 className="text-[15px] font-semibold text-text-primary mb-md">Category</h3>
            <div className="flex flex-col gap-sm max-h-64 overflow-y-auto">
              <label className="flex items-center gap-sm text-[14px] text-text-secondary cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={category === ''}
                  onChange={() => updateFilter('category', '')}
                  className="text-primary focus:ring-primary"
                />
                All categories
              </label>
              {CATEGORIES.map((c) => (
                <label key={c} className="flex items-center gap-sm text-[14px] text-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === c}
                    onChange={() => updateFilter('category', c)}
                    className="text-primary focus:ring-primary"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-border p-lg">
            <h3 className="text-[15px] font-semibold text-text-primary mb-md">Region</h3>
            <div className="flex flex-col gap-sm">
              <label className="flex items-center gap-sm text-[14px] text-text-secondary cursor-pointer">
                <input
                  type="radio"
                  name="region"
                  checked={region === ''}
                  onChange={() => updateFilter('region', '')}
                  className="text-primary focus:ring-primary"
                />
                All regions
              </label>
              {REGIONS.map((r) => (
                <label key={r} className="flex items-center gap-sm text-[14px] text-text-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="region"
                    checked={region === r}
                    onChange={() => updateFilter('region', r)}
                    className="text-primary focus:ring-primary"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col gap-lg">
          <div className="flex flex-col gap-md">
            <h1 className="text-[28px] font-bold text-text-primary">Explore campaigns</h1>
            <div className="relative max-w-xl">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-text-secondary">
                search
              </span>
              <input
                defaultValue={q}
                onKeyDown={(e) => e.key === 'Enter' && updateFilter('q', e.target.value)}
                onBlur={(e) => updateFilter('q', e.target.value)}
                placeholder="Search campaigns, causes, or communities"
                className="w-full pl-4xl pr-lg py-sm h-[44px] rounded border border-border bg-surface text-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-surface border border-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <EmptyState icon="wifi_off" title="Couldn't load campaigns" description={error} />
          ) : campaigns.length === 0 ? (
            <EmptyState
              icon="search_off"
              title="No campaigns match these filters"
              description="Try a different category or region, or clear your search."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {campaigns.map((c) => (
                <CampaignCard key={c._id} campaign={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
