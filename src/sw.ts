/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();

const REMINDER_TAG = "meal-reminder";

interface ReminderPayload {
  reminderAt: number;
  nextMealAt: number;
}

let activeReminder: ReminderPayload | null = null;
let checkInterval: ReturnType<typeof setInterval> | null = null;
let notifiedInWindow = false;

function startReminderChecks(): void {
  if (checkInterval) clearInterval(checkInterval);
  notifiedInWindow = false;
  checkInterval = setInterval(() => {
    void checkReminder();
  }, 60_000);
  void checkReminder();
}

async function checkReminder(): Promise<void> {
  if (!activeReminder) return;
  const now = Date.now();
  const { reminderAt, nextMealAt } = activeReminder;
  if (now >= reminderAt && now < nextMealAt && !notifiedInWindow) {
    await self.registration.showNotification("Meal in 1 hour", {
      body: "Time to plan your next meal.",
      tag: REMINDER_TAG,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      data: { url: "/" },
    });
    notifiedInWindow = true;
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data?.url as string | undefined) ?? "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});

self.addEventListener("message", (event) => {
  const data = event.data as {
    type?: string;
    payload?: ReminderPayload;
  };

  if (data.type === "SET_REMINDER" && data.payload) {
    activeReminder = data.payload;
    startReminderChecks();
  }

  if (data.type === "CLEAR_REMINDER") {
    activeReminder = null;
    notifiedInWindow = false;
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }

  if (data.type === "CHECK_NOW") {
    void checkReminder();
  }
});
