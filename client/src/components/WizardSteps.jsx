// Always show progress through a multi-step process (Design_Rules.md Rule 26).
export default function WizardSteps({ steps, current }) {
  return (
    <div className="flex items-center gap-sm mb-2xl">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <div key={label} className="flex items-center gap-sm">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                done ? 'bg-primary text-white' : active ? 'bg-primary/10 text-primary border border-primary' : 'bg-background text-text-secondary border border-border'
              }`}
            >
              {done ? '✓' : stepNum}
            </div>
            <span className={`text-[13px] ${active ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>{label}</span>
            {stepNum < steps.length && <div className="w-8 h-px bg-border mx-sm" />}
          </div>
        );
      })}
    </div>
  );
}
