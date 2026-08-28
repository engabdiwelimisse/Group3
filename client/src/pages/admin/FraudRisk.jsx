import DashboardLayout from '../../components/DashboardLayout';
import SampleDataNotice from '../../components/SampleDataNotice';
import Button from '../../components/Button';
import { ADMIN_NAV } from './nav';

// Sample data reflects the risk-scoring design in the spec (Section 21) —
// the scoring engine itself is not implemented yet (see PROGRESS.md).
const SAMPLE_CASES = [
  { id: '1', subject: 'Campaign — "Emergency shelter fund"', signal: 'Unusual donation velocity', score: 'HIGH' },
  { id: '2', subject: 'User — a.mohamed@example.com', signal: 'Multiple accounts, same device', score: 'MEDIUM' },
  { id: '3', subject: 'Campaign — "Business restart loan"', signal: 'New account, high goal amount', score: 'LOW' },
];

const SCORE_COLOR = { LOW: 'text-text-secondary', MEDIUM: 'text-warning', HIGH: 'text-error', CRITICAL: 'text-error' };

export default function FraudRisk() {
  return (
    <DashboardLayout title="Admin" nav={ADMIN_NAV}>
      <div className="flex flex-col gap-xl">
        <h1 className="text-[24px] font-bold text-text-primary">Fraud &amp; risk</h1>
        <SampleDataNotice feature="Fraud scoring" />

        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {SAMPLE_CASES.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-lg gap-md flex-wrap">
              <div>
                <p className="text-[14px] font-medium text-text-primary">{c.subject}</p>
                <p className="text-[13px] text-text-secondary">{c.signal}</p>
              </div>
              <div className="flex items-center gap-lg">
                <span className={`text-[13px] font-semibold ${SCORE_COLOR[c.score]}`}>{c.score}</span>
                <Button disabled variant="secondary" className="h-[34px] px-md text-[13px]">Review</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
