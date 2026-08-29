const LABELS = {
  identity_verified: { label: 'Identity Verified', icon: 'verified' },
  beneficiary_verified: { label: 'Beneficiary Verified', icon: 'gpp_good' },
  payment_verified: { label: 'Payment Verified', icon: 'payments' },
  organization_verified: { label: 'Organization Verified', icon: 'domain_verification' },
};

// Trust signals must stay visible, not decorative — never imply a guarantee
// that everything about a campaign is true (Design_Rules.md Rule 18).
export default function VerificationBadge({ type, compact = false }) {
  const meta = LABELS[type];
  if (!meta) return null;

  return (
    <span
      className={`inline-flex items-center gap-xs bg-background border border-border rounded-sm text-text-secondary ${
        compact ? 'px-sm py-[2px] text-[12px]' : 'px-md py-xs text-[13px]'
      }`}
    >
      <span className="material-symbols-outlined text-success" style={{ fontSize: compact ? 14 : 16 }}>
        {meta.icon}
      </span>
      {meta.label}
    </span>
  );
}
