// Design_Rules.md Rule 43 forbids fake/meaningless data presented as real —
// when a subsystem isn't built yet, we say so plainly instead of pretending.
export default function SampleDataNotice({ feature }) {
  return (
    <div className="flex items-center gap-sm bg-warning/10 border border-warning/30 text-warning rounded-lg px-lg py-md text-[13px]">
      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>science</span>
      Preview layout — {feature} is not yet connected to live data. Actions below are disabled.
    </div>
  );
}
