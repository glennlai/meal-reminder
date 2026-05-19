import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HoursInput } from "@/components/hours-input";
import { PhotoCapture } from "@/components/photo-capture";
import { SchedulePreview } from "@/components/schedule-preview";
import { useSchedule } from "@/context/schedule-provider";
import { resizePhoto } from "@/lib/image-resize";
import { validateHours } from "@/lib/schedule";

export interface LogMealLocationState {
  mealSaved?: boolean;
  promptNotifications?: boolean;
}

export function LogMealPage() {
  const navigate = useNavigate();
  const { logMeal } = useSchedule();
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [hours, setHours] = useState("3");
  const [hoursError, setHoursError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!photoBlob) {
      setSubmitError("Please add a meal photo");
      return;
    }

    const parsed = parseFloat(hours);
    const validation = validateHours(parsed);
    if (validation) {
      setHoursError(validation);
      return;
    }
    setHoursError(null);

    setSaving(true);
    try {
      const resized = await resizePhoto(photoBlob);
      await logMeal({ photoBlob: resized, hoursToNextMeal: parsed });
      navigate("/meal-reminder/home", {
        replace: true,
        state: {
          mealSaved: true,
          promptNotifications: true,
        } satisfies LogMealLocationState,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not save meal",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <PhotoCapture onPhoto={setPhotoBlob} />
      <HoursInput
        value={hours}
        onChange={(v) => {
          setHours(v);
          setHoursError(null);
        }}
        error={hoursError}
      />
      <SchedulePreview hours={hours} />

      {submitError && (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="interactive-focus w-full rounded-xl bg-brand-700 py-3.5 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save meal & start timer"}
      </button>
    </form>
  );
}
