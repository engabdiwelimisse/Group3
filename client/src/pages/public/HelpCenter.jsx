import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';

const FAQS = [
  {
    q: 'How do I know a campaign is real?',
    a: 'Every campaign shows verification badges for the organizer and beneficiary. You can also read the organizer\'s updates to see proof of how funds are being used.',
  },
  {
    q: 'What payment methods can I use to donate?',
    a: 'Mobile money (EVC Plus, eDahab, Zaad) is supported for donors inside Somalia. Card payments are available for diaspora donors abroad.',
  },
  {
    q: 'Can I donate anonymously?',
    a: 'Yes. Your name will not be shown publicly, but you will still receive a receipt and can access your donation history.',
  },
  {
    q: 'How long does a withdrawal take?',
    a: 'Beneficiary verification must be complete first. After that, most withdrawals are reviewed within a few business days.',
  },
  {
    q: 'What if I suspect fraud?',
    a: 'Use the "Report" button on the campaign page. Our Trust & Safety team reviews every report.',
  },
];

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-3xl max-w-2xl">
        <h1 className="text-[32px] font-bold text-text-primary mb-sm">Help Center</h1>
        <p className="text-[15px] text-text-secondary mb-2xl">
          Answers to common questions. Still need help?{' '}
          <Link to="/contact" className="text-primary hover:underline">Contact us</Link>.
        </p>

        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="w-full flex items-center justify-between py-lg text-left"
                >
                  <span className="text-[15px] font-medium text-text-primary">{item.q}</span>
                  <span className="material-symbols-outlined text-text-secondary">
                    {open ? 'remove' : 'add'}
                  </span>
                </button>
                {open && <p className="text-[14px] text-text-secondary pb-lg pr-2xl">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
