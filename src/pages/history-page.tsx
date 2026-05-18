import { useEffect, useState } from "react";
import { MealCard } from "@/components/meal-card";
import { mealRepository } from "@/repositories/local-meal-repository";
import type { MealEntry } from "@/types/meal";

export function HistoryPage() {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void mealRepository.listHistory().then((list) => {
      setEntries(list);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-brand-700">Loading history…</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-brand-700 shadow-sm ring-1 ring-brand-100">
        No meals logged yet.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.id}>
          <MealCard entry={entry} compact />
        </li>
      ))}
    </ul>
  );
}
