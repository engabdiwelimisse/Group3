import PageLayout from '../../components/PageLayout';
import VerificationBadge from '../../components/VerificationBadge';

const BADGES = ['identity_verified', 'beneficiary_verified', 'payment_verified', 'organization_verified'];

export default function Safety() {
  return (
    <PageLayout>
      <div className="max-w-container mx-auto px-xl py-3xl flex flex-col gap-3xl max-w-3xl">
        <div>
          <h1 className="text-[32px] font-bold text-text-primary mb-sm">Safety &amp; Trust</h1>
          <p className="text-[15px] text-text-secondary">
            Trust is the foundation of Kaalmo. Here is what verification means, and what it does not mean.
          </p>
        </div>

        <div className="flex flex-col gap-lg">
          <h2 className="text-[20px] font-semibold text-text-primary">Verification badges</h2>
          <div className="flex flex-wrap gap-md">
            {BADGES.map((b) => (
              <VerificationBadge key={b} type={b} />
            ))}
          </div>
          {/* Honest language required by Design_Rules.md Rule 18 — never imply a
              guarantee about the campaign as a whole. */}
          <p className="text-[14px] text-text-secondary bg-background border border-border rounded-lg p-lg">
            A verification badge confirms that we checked a specific detail — such as an ID document or a
            beneficiary's identity. It does not guarantee that every claim in a campaign story is true.
            Always read the story and updates before donating.
          </p>
        </div>

        <div className="flex flex-col gap-md">
          <h2 className="text-[20px] font-semibold text-text-primary">How we review campaigns</h2>
          <p className="text-[14px] text-text-secondary">
            Every campaign is reviewed before it goes live. Our team checks the organizer's identity, the
            beneficiary's documentation, and the campaign story for consistency. Campaigns can be
            suspended or frozen if something looks wrong after they go live.
          </p>
        </div>

        <div className="flex flex-col gap-md">
          <h2 className="text-[20px] font-semibold text-text-primary">Reporting a concern</h2>
          <p className="text-[14px] text-text-secondary">
            If something about a campaign looks wrong, use the "Report" button on the campaign page.
            Our Trust &amp; Safety team reviews every report.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
