import PageLayout from '../../components/PageLayout';

const ORGANIZER_STEPS = [
  { title: 'Create your campaign', text: 'Tell your story, set a goal, and add photos in Somali or English.' },
  { title: 'Get verified', text: 'We confirm the organizer and beneficiary identity before the campaign goes live.' },
  { title: 'Share and receive donations', text: 'Donors can give by mobile money or card, and see your progress in real time.' },
  { title: 'Request a withdrawal', text: 'Once your beneficiary is verified, request a payout to mobile money or bank.' },
];

const DONOR_STEPS = [
  { title: 'Find a campaign', text: 'Browse verified campaigns by category, region, or urgency.' },
  { title: 'Check the verification badges', text: 'See who the organizer is, whether the beneficiary is verified, and read recent updates.' },
  { title: 'Donate', text: 'Give by mobile money or card — you choose the amount.' },
  { title: 'Follow the impact', text: 'Get updates from the organizer showing how your donation was used.' },
];

function StepList({ steps }) {
  return (
    <ol className="flex flex-col gap-lg">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-lg">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-[14px]">
            {i + 1}
          </span>
          <div>
            <h3 className="text-[16px] font-semibold text-text-primary">{step.title}</h3>
            <p className="text-[14px] text-text-secondary mt-xs">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorks() {
  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-3xl flex flex-col gap-4xl">
        <div className="max-w-2xl">
          <h1 className="text-[32px] font-bold text-text-primary mb-sm">How Kaalmo works</h1>
          <p className="text-[15px] text-text-secondary">
            Kaalmo combines verification with the payment methods Somalis already use, so raising and
            giving money is simple and trustworthy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4xl">
          <div>
            <h2 className="text-[20px] font-semibold text-text-primary mb-lg">For organizers</h2>
            <StepList steps={ORGANIZER_STEPS} />
          </div>
          <div>
            <h2 className="text-[20px] font-semibold text-text-primary mb-lg">For donors</h2>
            <StepList steps={DONOR_STEPS} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
