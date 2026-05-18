import { getReminderStateLabel } from "@/lib/schedule";
import type { ReminderState } from "@/types/meal";

const badgeStyles: Record<string, string> = {
  upcoming: "bg-brand-100 text-brand-800 ring-brand-200",
  inReminderWindow: "bg-amber-100 text-amber-900 ring-amber-300",
  due: "bg-amber-200 text-amber-950 ring-amber-400",
  passed: "bg-stone-200 text-stone-800 ring-stone-300",
  none: "bg-stone-100 text-stone-700 ring-stone-200",
};

interface ReminderStatusBadgeProps {
  state: ReminderState;
  className?: string;
}

export function ReminderStatusBadge({
  state,
  className = "",
}: ReminderStatusBadgeProps) {
  const label = getReminderStateLabel(state);
  const style = badgeStyles[state] ?? badgeStyles.none;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${style} ${className}`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}
