// Never render "No data found." — always give the user context and, where
// relevant, an action (Design_Rules.md Rule 27).
export default function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center gap-sm py-4xl px-lg">
      <span className="material-symbols-outlined text-text-secondary" style={{ fontSize: 40 }}>
        {icon}
      </span>
      <h3 className="text-[16px] font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-[14px] text-text-secondary max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
