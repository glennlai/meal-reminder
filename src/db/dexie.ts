import Dexie, { type EntityTable } from "dexie";
import type { MealEntry } from "@/types/meal";

export interface PhotoRecord {
  id: string;
  blob: Blob;
}

export interface MetaRecord {
  key: string;
  value: string;
}

export interface PendingReminderRecord {
  id: string;
  reminderAt: number;
  nextMealAt: number;
  lastNotifiedAt: number | null;
}

export class MealDatabase extends Dexie {
  meals!: EntityTable<MealEntry, "id">;
  photos!: EntityTable<PhotoRecord, "id">;
  meta!: EntityTable<MetaRecord, "key">;
  pendingReminder!: EntityTable<PendingReminderRecord, "id">;

  constructor() {
    super("MealReminderDB");
    this.version(1).stores({
      meals: "id, loggedAt, nextMealAt, createdAt",
      photos: "id",
      meta: "key",
      pendingReminder: "id",
    });
  }
}

export const db = new MealDatabase();

export const ACTIVE_ENTRY_KEY = "activeEntryId";
