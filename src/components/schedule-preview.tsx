import {
  computeNextMeal,
  computeReminderAt,
  formatDateTime,
  validateHours,
} from "@/lib/schedule";

interface SchedulePreviewProps {
  hours: string;
}

export function SchedulePreview({ hours }: SchedulePreviewProps) {
  const parsed = parseFloat(hours);
  if (validateHours(parsed)) return null;

  const loggedAt = Date.now();
  const nextMealAt = computeNextMeal(loggedAt, parsed);
  const reminderAt = computeReminderAt(nextMealAt);

  return (
    <section
      className="rounded-xl bg-brand-50 p-4 text-sm text-brand-800 ring-1 ring-brand-100"
      aria-label="Schedule preview"
    >
      <p>
        <span className="font-medium text-brand-900">Next meal:</span>{" "}
        {formatDateTime(nextMealAt)}
      </p>
      <p className="mt-1">
        <span className="font-medium text-brand-900">Reminder:</span>{" "}
        {formatDateTime(reminderAt)}
      </p>
    </section>
  );
}
