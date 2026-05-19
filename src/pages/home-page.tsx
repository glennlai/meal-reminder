import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Countdown } from "@/components/countdown";
import {
  NotificationPromptDialog,
  shouldShowNotificationPrompt,
} from "@/components/notification-prompt-dialog";
import { NotificationStatusChip } from "@/components/notification-status-chip";
import { OnboardingBanner } from "@/components/onboarding-banner";
import { Toast } from "@/components/toast";
import { useSchedule } from "@/context/schedule-provider";
import { getReminderState } from "@/lib/schedule";
import type { AddMealLocationState } from "@/pages/add-meal-page";

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as AddMealLocationState | null;
  const { schedule, loading, clearSchedule } = useSchedule();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [notificationPromptOpen, setNotificationPromptOpen] = useState(false);

  useEffect(() => {
    if (!navState?.mealSaved) return;

    setToastVisible(true);

    if (navState.promptNotifications && shouldShowNotificationPrompt()) {
      setNotificationPromptOpen(true);
    }

    navigate("/", { replace: true, state: null });
  }, [navState, navigate]);

  if (loading) {
    return (
      <p className="text-brand-700" role="status" aria-live="polite">
        Loading…
      </p>
    );
  }

  const handleConfirmClear = () => {
    void clearSchedule().then(() => setConfirmClearOpen(false));
  };

  const state = schedule
    ? getReminderState(
        Date.now(),
        schedule.reminderAt,
        schedule.nextMealAt,
      )
    : null;

  const showPrimaryLogCta = state === "due" || state === "passed";
  const showSubtleLogEarly =
    schedule && (state === "upcoming" || state === "inReminderWindow");

  return (
    <div className="space-y-6">
      <Toast
        message="Meal saved — timer started!"
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />

      <NotificationPromptDialog
        open={notificationPromptOpen}
        onClose={() => setNotificationPromptOpen(false)}
      />

      <OnboardingBanner />

      {schedule && (
        <div className="flex justify-end">
          <NotificationStatusChip />
        </div>
      )}

      {!schedule ? (
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-brand-100">
          <p className="text-lg font-medium text-brand-900">No meal logged yet</p>
          <p className="mt-2 text-sm text-brand-700">
            Take a photo and set when you want to eat next.
          </p>
          <Link
            to="/meal-reminder/add"
            className="interactive-focus mt-6 inline-block rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800"
          >
            Log your first meal
          </Link>
        </section>
      ) : (
        <>
          <Countdown schedule={schedule} />

          {showPrimaryLogCta && (
            <Link
              to="/meal-reminder/add"
              className="interactive-focus block w-full rounded-xl bg-brand-700 py-3.5 text-center text-lg font-semibold text-white hover:bg-brand-800"
            >
              Log next meal
            </Link>
          )}

          {showSubtleLogEarly && (
            <p className="text-center text-sm text-brand-700">
              Eating early?{" "}
              <Link
                to="/meal-reminder/add"
                className="interactive-focus font-semibold text-brand-800 underline"
              >
                Log your next meal
              </Link>
            </p>
          )}

          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={confirmClearOpen}
            aria-controls="clear-schedule-dialog"
            className="interactive-focus w-full text-sm text-brand-600 underline"
          >
            Clear active schedule
          </button>

          <ConfirmDialog
            id="clear-schedule-dialog"
            open={confirmClearOpen}
            title="Clear active schedule?"
            description="This removes your current meal timer and reminder. Your meal history is kept."
            confirmLabel="Clear schedule"
            cancelLabel="Keep schedule"
            onConfirm={handleConfirmClear}
            onCancel={() => setConfirmClearOpen(false)}
          />
        </>
      )}
    </div>
  );
}
