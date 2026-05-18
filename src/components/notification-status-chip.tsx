import {
  getPermission,
  type AppNotificationPermission,
} from "@/lib/reminder-service";

const styles: Record<
  AppNotificationPermission,
  { label: string; className: string }
> = {
  granted: {
    label: "Notifications on",
    className: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  },
  denied: {
    label: "Notifications blocked",
    className: "bg-red-100 text-red-900 ring-red-200",
  },
  default: {
    label: "Notifications off",
    className: "bg-stone-100 text-stone-800 ring-stone-200",
  },
  unsupported: {
    label: "Notifications unavailable",
    className: "bg-stone-100 text-stone-600 ring-stone-200",
  },
};

export function NotificationStatusChip() {
  const permission = getPermission();
  const { label, className } = styles[permission];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
      role="status"
    >
      {label}
    </span>
  );
}
