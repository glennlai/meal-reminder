import { useEffect, useState } from "react";
import {
  getPermission,
  requestPermission,
  type AppNotificationPermission,
} from "@/lib/reminder-service";

const DISMISS_KEY = "meal-reminder-onboarding-dismissed";

function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISS_KEY) === "1",
  );
  const [permission, setPermission] = useState<AppNotificationPermission>(
    () => getPermission(),
  );

  useEffect(() => {
    setPermission(getPermission());
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const enableNotifications = async () => {
    const result = await requestPermission();
    setPermission(result);
  };

  return (
    <section
      className="mb-6 space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
      aria-label="Getting started"
    >
      <h2 className="font-semibold">Getting started</h2>
      <ul className="list-inside list-disc space-y-2 text-amber-900/90">
        <li>
          Install this app: use <strong>Add to Home Screen</strong> in your
          browser menu for the best experience.
        </li>
        {isIos() && (
          <li>
            On iPhone: open in Safari, tap Share, then Add to Home Screen.
            Allow notifications when prompted.
          </li>
        )}
        <li>
          Reminders work best while the app is open or when you reopen it.
          Fully closed tabs may miss alerts until you open the app again.
        </li>
        {!isStandalone() && (
          <li className="font-medium">
            Tip: install the PWA for more reliable behavior on mobile.
          </li>
        )}
      </ul>

      {permission !== "granted" && permission !== "unsupported" && (
        <button
          type="button"
          onClick={() => void enableNotifications()}
          className="interactive-focus w-full rounded-xl bg-brand-700 px-4 py-2.5 font-semibold text-white hover:bg-brand-800"
        >
          Enable notifications
        </button>
      )}

      {permission === "denied" && (
        <p className="text-xs text-amber-800">
          Notifications are blocked. Enable them in your browser or device
          settings.
        </p>
      )}

      <button
        type="button"
        onClick={dismiss}
        className="interactive-focus text-xs font-medium text-amber-800 underline"
      >
        Dismiss
      </button>
    </section>
  );
}
