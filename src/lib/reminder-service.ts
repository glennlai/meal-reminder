import { db } from "@/db/dexie";
import { mealRepository } from "@/repositories/local-meal-repository";
import { shouldNotify } from "@/lib/schedule";
import type { MealSchedule } from "@/types/meal";

export const REMINDER_TAG = "meal-reminder";
const NOTIFICATION_TITLE = "Meal in 1 hour";
const NOTIFICATION_BODY = "Time to plan your next meal.";

export type AppNotificationPermission =
  | globalThis.NotificationPermission
  | "unsupported";

function isSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestPermission(): Promise<AppNotificationPermission> {
  if (!isSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export function getPermission(): AppNotificationPermission {
  if (!isSupported()) return "unsupported";
  return Notification.permission;
}

const SW_READY_TIMEOUT_MS = 2_000;

/** Avoid hanging on `serviceWorker.ready` when no SW controls the page yet. */
async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const existing = await navigator.serviceWorker.getRegistration();
    if (existing?.active) return existing;

    return await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), SW_READY_TIMEOUT_MS),
      ),
    ]);
  } catch {
    return null;
  }
}

export async function syncReminderToServiceWorker(
  schedule: MealSchedule,
): Promise<void> {
  const registration = await getServiceWorkerRegistration();
  if (!registration?.active) return;

  registration.active.postMessage({
    type: "SET_REMINDER",
    payload: {
      reminderAt: schedule.reminderAt,
      nextMealAt: schedule.nextMealAt,
    },
  });
}

export async function clearServiceWorkerReminder(): Promise<void> {
  const registration = await getServiceWorkerRegistration();
  registration?.active?.postMessage({ type: "CLEAR_REMINDER" });
}

export async function showMealNotification(): Promise<boolean> {
  if (!isSupported() || Notification.permission !== "granted") return false;

  const registration = await getServiceWorkerRegistration();
  if (registration) {
    await registration.showNotification(NOTIFICATION_TITLE, {
      body: NOTIFICATION_BODY,
      tag: REMINDER_TAG,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      data: { url: "/" },
    });
    return true;
  }

  new Notification(NOTIFICATION_TITLE, {
    body: NOTIFICATION_BODY,
    tag: REMINDER_TAG,
    icon: "/favicon.svg",
  });
  return true;
}

export async function scheduleFor(schedule: MealSchedule): Promise<void> {
  await syncReminderToServiceWorker(schedule);
}

export async function cancel(): Promise<void> {
  await clearServiceWorkerReminder();
  const registration = await getServiceWorkerRegistration();
  if (!registration) return;

  try {
    const notifications = await registration.getNotifications({
      tag: REMINDER_TAG,
    });
    notifications.forEach((n) => n.close());
  } catch {
    // Notifications API may be unavailable
  }
}

export async function checkAndNotify(now = Date.now()): Promise<boolean> {
  const pending = await db.pendingReminder.get("active");
  if (!pending) return false;

  if (
    !shouldNotify(
      now,
      pending.reminderAt,
      pending.nextMealAt,
      pending.lastNotifiedAt,
    )
  ) {
    return false;
  }

  const shown = await showMealNotification();
  if (shown) {
    await mealRepository.markNotified(now);
    const registration = await getServiceWorkerRegistration();
    registration?.active?.postMessage({ type: "CHECK_NOW" });
  }
  return shown;
}

export async function onAppVisible(): Promise<void> {
  await checkAndNotify();
  const schedule = await mealRepository.getActiveSchedule();
  if (schedule) {
    await syncReminderToServiceWorker(schedule);
    const registration = await getServiceWorkerRegistration();
    registration?.active?.postMessage({ type: "CHECK_NOW" });
  }
}
