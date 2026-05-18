import { useEffect, useId, useRef } from "react";
import {
  getPermission,
  requestPermission,
} from "@/lib/reminder-service";

const DISMISS_KEY = "meal-reminder-notification-prompt-dismissed";

interface NotificationPromptDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPromptDialog({
  open,
  onClose,
}: NotificationPromptDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const enableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      enableRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      localStorage.setItem(DISMISS_KEY, "1");
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    onClose();
  };

  const enable = async () => {
    await requestPermission();
    dismiss();
  };

  if (getPermission() === "granted" || getPermission() === "unsupported") {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      id="notification-prompt-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="w-[min(100%,24rem)] rounded-2xl border-0 bg-white p-6 text-brand-900 shadow-xl backdrop:bg-brand-900/40"
      onClose={dismiss}
    >
      <h2 id={titleId} className="text-lg font-semibold">
        Get reminded 1 hour before?
      </h2>
      <p id={descriptionId} className="mt-2 text-sm text-brand-700">
        We&apos;ll notify you about one hour before your next meal. Works best
        if you install the app and allow notifications.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <button
          ref={enableRef}
          type="button"
          onClick={() => void enable()}
          className="interactive-focus w-full rounded-xl bg-brand-700 py-3 font-semibold text-white hover:bg-brand-800"
        >
          Enable notifications
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="interactive-focus w-full rounded-xl border border-brand-200 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50"
        >
          Not now
        </button>
      </div>
    </dialog>
  );
}

export function shouldShowNotificationPrompt(): boolean {
  if (localStorage.getItem(DISMISS_KEY) === "1") return false;
  const perm = getPermission();
  return perm === "default" || perm === "denied";
}
