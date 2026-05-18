import { usePhotoUrl } from "@/hooks/use-photo-url";
import { formatDateTime } from "@/lib/schedule";
import type { MealEntry } from "@/types/meal";

interface MealCardProps {
  entry: MealEntry;
  compact?: boolean;
}

export function MealCard({ entry, compact }: MealCardProps) {
  const photoUrl = usePhotoUrl(entry.photoBlobId);

  return (
    <article
      className={`flex gap-4 rounded-2xl bg-white shadow-sm ring-1 ring-brand-100 ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-xl bg-brand-100 ${
          compact ? "h-16 w-16" : "h-24 w-24"
        }`}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Meal"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-brand-600">
            …
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-brand-900">
          Logged {formatDateTime(entry.loggedAt)}
        </p>
        <p className="mt-1 text-sm text-brand-700/80">
          Next meal: {formatDateTime(entry.nextMealAt)}
        </p>
        <p className="mt-0.5 text-xs text-brand-600">
          Interval: {entry.hoursToNextMeal}h
        </p>
      </div>
    </article>
  );
}
