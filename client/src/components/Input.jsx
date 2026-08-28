export default function Input({ label, error, id, ...props }) {
  return (
    <div className="flex flex-col gap-sm">
      {label && (
        <label htmlFor={id} className="text-[14px] font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full h-[44px] px-lg rounded border bg-surface text-text-primary placeholder:text-text-secondary outline-none transition-colors focus:border-2 focus:border-primary ${
          error ? 'border-error' : 'border-border'
        }`}
        {...props}
      />
      {error && <span className="text-[13px] text-error">{error}</span>}
    </div>
  );
}
