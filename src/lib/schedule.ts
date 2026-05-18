import type { ReminderState } from "@/types/meal";

export const HOUR_MS = 60 * 60 * 1000;
export const REMINDER_LEAD_MS = HOUR_MS;

export const MIN_HOURS = 0.25;
export const MAX_HOURS = 24;

export function computeNextMeal(loggedAt: number, hours: number): number {
  return loggedAt + hours * HOUR_MS;
}

export function computeReminderAt(nextMealAt: number): number {
  return nextMealAt - REMINDER_LEAD_MS;
}

export function getReminderState(
  now: number,
  reminderAt: number,
  nextMealAt: number,
): ReminderState {
  if (now < reminderAt) return "upcoming";
  if (now >= reminderAt && now < nextMealAt) return "inReminderWindow";
  if (now >= nextMealAt && now < nextMealAt + HOUR_MS) return "due";
  if (now >= nextMealAt) return "passed";
  return "none";
}

/** Short text label for UI badges (not color-only). */
export function getReminderStateLabel(state: ReminderState): string {
  switch (state) {
    case "upcoming":
      return "Scheduled";
    case "inReminderWindow":
      return "Reminder";
    case "due":
      return "Meal time";
    case "passed":
      return "Passed";
    default:
      return "Unknown";
  }
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "0m";
  const totalMinutes = Math.ceil(ms / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatDateTime(epochMs: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(epochMs));
}

export function validateHours(hours: number): string | null {
  if (Number.isNaN(hours)) return "Enter a valid number";
  if (hours < MIN_HOURS || hours > MAX_HOURS) {
    return `Hours must be between ${MIN_HOURS} and ${MAX_HOURS}`;
  }
  return null;
}

export function shouldNotify(
  now: number,
  reminderAt: number,
  nextMealAt: number,
  lastNotifiedAt: number | null,
): boolean {
  const state = getReminderState(now, reminderAt, nextMealAt);
  if (state !== "inReminderWindow" && state !== "due") return false;
  if (lastNotifiedAt && now - lastNotifiedAt < 30 * 60 * 1000) return false;
  return true;
}
