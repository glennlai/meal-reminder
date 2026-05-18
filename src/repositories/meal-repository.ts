import type { LogMealInput, MealEntry, MealSchedule } from "@/types/meal";

export interface MealRepository {
  getActiveSchedule(): Promise<MealSchedule | null>;
  logMeal(input: LogMealInput): Promise<MealSchedule>;
  listHistory(limit?: number): Promise<MealEntry[]>;
  getPhotoBlob(photoBlobId: string): Promise<Blob | null>;
  clearActiveSchedule(): Promise<void>;
}
