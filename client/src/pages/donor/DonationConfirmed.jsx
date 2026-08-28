import { useLocation, Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';

// Payment state must always be honest — a manually-recorded donation is
// 'pending' until an admin confirms it, never shown as if it already
// succeeded (Design_Rules.md Rule 17).
export default function DonationConfirmed() {
  const { id } = useParams();
  const location = useLocation();
  const donation = location.state?.donation;
  const campaignTitle = location.state?.campaignTitle;

  return (
    <PageLayout noFooter>
      <div className="max-w-[480px] mx-auto px-xl py-4xl">
        <div className="bg-surface border border-border rounded-lg p-2xl flex flex-col items-center text-center gap-lg">
          <span className="material-symbols-outlined text-success" style={{ fontSize: 48 }}>
            check_circle
          </span>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary mb-xs">Donation received</h1>
            <p className="text-[14px] text-text-secondary">
              Thank you for supporting {campaignTitle?.en || campaignTitle?.so || 'this campaign'}.
            </p>
          </div>

          {donation && (
            <div className="w-full bg-background border border-border rounded-lg p-lg flex flex-col gap-sm text-left">
              <div className="flex justify-between text-[14px]">
                <span className="text-text-secondary">Amount</span>
                <span className="font-semibold text-text-primary">${donation.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-text-secondary">Status</span>
                <StatusPill status={donation.status} />
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-text-secondary">Reference</span>
                <span className="font-mono text-[12px] text-text-primary">{donation._id}</span>
              </div>
            </div>
          )}

          <p className="text-[13px] text-text-secondary">
            Your donation is awaiting confirmation. You'll be notified once it's confirmed.
          </p>

          <div className="flex gap-md w-full">
            <Link to={`/campaigns/${id}`} className="flex-1">
              <Button variant="secondary" className="w-full">Back to campaign</Button>
            </Link>
            <Link to="/explore" className="flex-1">
              <Button className="w-full">Explore more</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
