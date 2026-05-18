const PRESETS = [2, 3, 4, 5] as const;

interface HourPresetsProps {
  value: string;
  onSelect: (hours: string) => void;
}

export function HourPresets({ value, onSelect }: HourPresetsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Quick hour presets">
      {PRESETS.map((hours) => {
        const selected = parseFloat(value) === hours;
        return (
          <button
            key={hours}
            type="button"
            onClick={() => onSelect(String(hours))}
            aria-pressed={selected}
            className={`interactive-focus rounded-full px-4 py-2 text-sm font-semibold transition ${
              selected
                ? "bg-brand-700 text-white"
                : "bg-white text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50"
            }`}
          >
            {hours}h
          </button>
        );
      })}
    </div>
  );
}
