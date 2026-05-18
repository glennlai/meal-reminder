import { v4 as uuid } from "uuid";
import { ACTIVE_ENTRY_KEY, db } from "@/db/dexie";
import {
  computeNextMeal,
  computeReminderAt,
} from "@/lib/schedule";
import type { LogMealInput, MealEntry, MealSchedule } from "@/types/meal";
import type { MealRepository } from "./meal-repository";

const PENDING_REMINDER_ID = "active";

export class LocalMealRepository implements MealRepository {
  async getActiveSchedule(): Promise<MealSchedule | null> {
    const meta = await db.meta.get(ACTIVE_ENTRY_KEY);
    if (!meta?.value) return null;

    const entry = await db.meals.get(meta.value);
    if (!entry) return null;

    return {
      entryId: entry.id,
      nextMealAt: entry.nextMealAt,
      reminderAt: entry.reminderAt,
      entry,
    };
  }

  async logMeal(input: LogMealInput): Promise<MealSchedule> {
    const loggedAt = input.loggedAt ?? Date.now();
    const nextMealAt = computeNextMeal(loggedAt, input.hoursToNextMeal);
    const reminderAt = computeReminderAt(nextMealAt);
    const photoBlobId = uuid();
    const id = uuid();
    const createdAt = Date.now();

    const entry: MealEntry = {
      id,
      photoBlobId,
      loggedAt,
      hoursToNextMeal: input.hoursToNextMeal,
      nextMealAt,
      reminderAt,
      createdAt,
    };

    await db.transaction("rw", db.photos, db.meals, db.meta, db.pendingReminder, async () => {
      await db.photos.put({ id: photoBlobId, blob: input.photoBlob });
      await db.meals.put(entry);
      await db.meta.put({ key: ACTIVE_ENTRY_KEY, value: id });
      await db.pendingReminder.put({
        id: PENDING_REMINDER_ID,
        reminderAt,
        nextMealAt,
        lastNotifiedAt: null,
      });
    });

    return {
      entryId: id,
      nextMealAt,
      reminderAt,
      entry,
    };
  }

  async listHistory(limit = 50): Promise<MealEntry[]> {
    return db.meals.orderBy("loggedAt").reverse().limit(limit).toArray();
  }

  async getPhotoBlob(photoBlobId: string): Promise<Blob | null> {
    const record = await db.photos.get(photoBlobId);
    return record?.blob ?? null;
  }

  async clearActiveSchedule(): Promise<void> {
    await db.transaction("rw", db.meta, db.pendingReminder, async () => {
      await db.meta.delete(ACTIVE_ENTRY_KEY);
      await db.pendingReminder.delete(PENDING_REMINDER_ID);
    });
  }

  async getPendingReminder() {
    return db.pendingReminder.get(PENDING_REMINDER_ID);
  }

  async markNotified(now: number): Promise<void> {
    const pending = await db.pendingReminder.get(PENDING_REMINDER_ID);
    if (!pending) return;
    await db.pendingReminder.put({ ...pending, lastNotifiedAt: now });
  }
}

export const mealRepository = new LocalMealRepository();
