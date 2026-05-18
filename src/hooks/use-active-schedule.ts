import { useCallback, useEffect, useState } from "react";
import { mealRepository } from "@/repositories/local-meal-repository";
import {
  cancel,
  checkAndNotify,
  onAppVisible,
  scheduleFor,
} from "@/lib/reminder-service";
import type { LogMealInput, MealSchedule } from "@/types/meal";

export function useActiveSchedule() {
  const [schedule, setSchedule] = useState<MealSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const active = await mealRepository.getActiveSchedule();
      setSchedule(active);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      void onAppVisible().then(() => refresh());
    };

    document.addEventListener("visibilitychange", handleVisibility);
    void onAppVisible();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh]);

  useEffect(() => {
    if (!schedule) return;

    const tick = () => {
      void checkAndNotify();
    };

    tick();
    const id = window.setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [schedule]);

  const logMeal = useCallback(
    async (input: LogMealInput) => {
      await cancel();
      const next = await mealRepository.logMeal(input);
      await scheduleFor(next);
      setSchedule(next);
      await checkAndNotify();
      return next;
    },
    [],
  );

  const clearSchedule = useCallback(async () => {
    await cancel();
    await mealRepository.clearActiveSchedule();
    setSchedule(null);
  }, []);

  return {
    schedule,
    loading,
    error,
    refresh,
    logMeal,
    clearSchedule,
  };
}
