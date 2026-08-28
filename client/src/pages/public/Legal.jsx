import PageLayout from '../../components/PageLayout';

export function Terms() {
  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-3xl max-w-2xl flex flex-col gap-md">
        <h1 className="text-[32px] font-bold text-text-primary">Terms of Service</h1>
        <p className="text-[14px] text-text-secondary">
          Kaalmo's full terms of service are being finalized with legal counsel before real-money launch
          (see Section 27 of the product specification). This page will be updated before the platform
          processes live donations.
        </p>
      </div>
    </PageLayout>
  );
}

export function Privacy() {
  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-3xl max-w-2xl flex flex-col gap-md">
        <h1 className="text-[32px] font-bold text-text-primary">Privacy Policy</h1>
        <p className="text-[14px] text-text-secondary">
          Kaalmo collects only the information needed to verify organizers, beneficiaries, and process
          donations. A complete privacy policy is being finalized with legal counsel before real-money
          launch.
        </p>
      </div>
    </PageLayout>
  );
}
