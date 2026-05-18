export interface MealEntry {
  id: string;
  photoBlobId: string;
  loggedAt: number;
  hoursToNextMeal: number;
  nextMealAt: number;
  reminderAt: number;
  createdAt: number;
}

export interface MealSchedule {
  entryId: string;
  nextMealAt: number;
  reminderAt: number;
  entry: MealEntry;
}

export interface LogMealInput {
  photoBlob: Blob;
  hoursToNextMeal: number;
  loggedAt?: number;
}

export type ReminderState =
  | "upcoming"
  | "inReminderWindow"
  | "due"
  | "passed"
  | "none";
