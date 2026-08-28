const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-surface text-primary border border-primary hover:bg-background',
  tertiary: 'text-primary hover:underline bg-transparent',
  destructive: 'bg-error text-white hover:opacity-90',
  // Used for CTAs on top of the primary-colored hero, where a primary button
  // would disappear against its own background (Design_Rules.md Rule 8).
  accent: 'bg-accent text-text-primary hover:opacity-90',
};

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-sm h-[44px] px-lg rounded font-medium text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
