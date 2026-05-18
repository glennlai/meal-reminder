import { HourPresets } from "@/components/hour-presets";
import { MAX_HOURS, MIN_HOURS } from "@/lib/schedule";

interface HoursInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  id?: string;
}

export function HoursInput({
  value,
  onChange,
  error,
  id = "hours",
}: HoursInputProps) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="block text-sm font-medium text-brand-900">
        Hours until next meal
      </label>
      <HourPresets value={value} onSelect={onChange} />
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step="0.25"
        min={MIN_HOURS}
        max={MAX_HOURS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 3"
        className="interactive-focus w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-lg text-brand-900 ring-brand-500 focus-visible:ring-2"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-xs text-brand-600">
          Between {MIN_HOURS} and {MAX_HOURS} hours. Decimals allowed (e.g. 2.5).
        </p>
      )}
    </div>
  );
}
