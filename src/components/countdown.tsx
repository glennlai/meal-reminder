import { ReminderStatusBadge } from "@/components/reminder-status-badge";
import { useCountdown } from "@/hooks/use-countdown";
import { usePhotoUrl } from "@/hooks/use-photo-url";
import {
  formatDateTime,
  getReminderState,
} from "@/lib/schedule";
import type { MealSchedule } from "@/types/meal";

interface CountdownProps {
  schedule: MealSchedule;
}

export function Countdown({ schedule }: CountdownProps) {
  const { label, remainingMs } = useCountdown(schedule.nextMealAt);
  const photoUrl = usePhotoUrl(schedule.entry.photoBlobId);
  const now = Date.now();
  const state = getReminderState(
    now,
    schedule.reminderAt,
    schedule.nextMealAt,
  );

  const statusMessage = (() => {
    switch (state) {
      case "upcoming":
        return `Reminder at ${formatDateTime(schedule.reminderAt)}`;
      case "inReminderWindow":
        return `Your next meal is in ${label}`;
      case "due":
        return "It's meal time!";
      case "passed":
        return "Meal time has passed — log your next meal";
      default:
        return "";
    }
  })();

  return (
    <section
      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-100"
      aria-labelledby="countdown-heading"
      aria-describedby="countdown-status countdown-detail"
    >
      {photoUrl && (
        <div className="relative aspect-[16/10] w-full bg-brand-100">
          <img
            src={photoUrl}
            alt="Your current meal"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <p
            id="countdown-heading"
            className="text-sm font-medium text-brand-600"
          >
            Next meal in
          </p>
          <ReminderStatusBadge state={state} />
        </div>
        <p
          className="mt-2 text-5xl font-bold tabular-nums tracking-tight text-brand-900"
          aria-live="polite"
          aria-atomic="true"
        >
          {remainingMs > 0 ? label : "Now"}
        </p>
        <p id="countdown-detail" className="mt-3 text-base text-brand-800">
          {formatDateTime(schedule.nextMealAt)}
        </p>
        <p
          id="countdown-status"
          className={`mt-2 text-sm ${
            state === "inReminderWindow" || state === "due"
              ? "font-semibold text-amber-800"
              : "text-brand-700/80"
          }`}
        >
          {statusMessage}
        </p>
        <p className="mt-3 text-xs text-brand-600">
          Logged {formatDateTime(schedule.entry.loggedAt)}
        </p>
      </div>
    </section>
  );
}
