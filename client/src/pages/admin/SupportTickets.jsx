import DashboardLayout from '../../components/DashboardLayout';
import SampleDataNotice from '../../components/SampleDataNotice';
import StatusPill from '../../components/StatusPill';
import { ADMIN_NAV } from './nav';

const SAMPLE_TICKETS = [
  { id: '1', from: 'Hodan Ali', subject: "Can't confirm my donation status", status: 'pending' },
  { id: '2', from: 'Yusuf Warsame', subject: 'Withdrawal has been under review for 5 days', status: 'pending' },
  { id: '3', from: 'Amina Cabdi', subject: 'Requesting a receipt for tax purposes', status: 'confirmed' },
];

export default function SupportTickets() {
  return (
    <DashboardLayout title="Admin" nav={ADMIN_NAV}>
      <div className="flex flex-col gap-xl">
        <h1 className="text-[24px] font-bold text-text-primary">Support tickets</h1>
        <SampleDataNotice feature="Support ticketing" />

        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {SAMPLE_TICKETS.map((t) => (
            <div key={t.id} className="flex items-center justify-between py-lg gap-md flex-wrap">
              <div>
                <p className="text-[14px] font-medium text-text-primary">{t.subject}</p>
                <p className="text-[13px] text-text-secondary">From {t.from}</p>
              </div>
              <StatusPill status={t.status} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
