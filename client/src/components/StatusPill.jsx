// Status must never be communicated by color alone (Design_Rules.md Rule 39) —
// each status always renders with its label text, color is a secondary cue.
const STATUS_STYLES = {
  draft: 'bg-background text-text-secondary border-border',
  submitted: 'bg-info/10 text-info border-info/30',
  under_review: 'bg-info/10 text-info border-info/30',
  approved: 'bg-success/10 text-success border-success/30',
  published: 'bg-success/10 text-success border-success/30',
  active: 'bg-success/10 text-success border-success/30',
  goal_reached: 'bg-accent/10 text-accent border-accent/30',
  withdrawal: 'bg-info/10 text-info border-info/30',
  completed: 'bg-success/10 text-success border-success/30',
  rejected: 'bg-error/10 text-error border-error/30',
  suspended: 'bg-warning/10 text-warning border-warning/30',
  frozen: 'bg-warning/10 text-warning border-warning/30',
  cancelled: 'bg-background text-text-secondary border-border',
  expired: 'bg-background text-text-secondary border-border',
  pending: 'bg-warning/10 text-warning border-warning/30',
  confirmed: 'bg-success/10 text-success border-success/30',
  failed: 'bg-error/10 text-error border-error/30',
  refunded: 'bg-info/10 text-info border-info/30',
  processing: 'bg-info/10 text-info border-info/30',
};

function toLabel(status) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusPill({ status }) {
  const style = STATUS_STYLES[status] || 'bg-background text-text-secondary border-border';
  return (
    <span className={`inline-flex items-center px-md py-xs rounded-sm border text-[13px] font-medium ${style}`}>
      {toLabel(status)}
    </span>
  );
}
