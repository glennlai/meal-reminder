import { describe, expect, it } from "vitest";
import {
  computeNextMeal,
  computeReminderAt,
  formatCountdown,
  getReminderState,
  getReminderStateLabel,
  HOUR_MS,
  shouldNotify,
  validateHours,
} from "./schedule";

describe("schedule", () => {
  const loggedAt = Date.parse("2026-05-18T12:00:00");

  it("computes next meal and reminder times", () => {
    const next = computeNextMeal(loggedAt, 3);
    expect(next).toBe(loggedAt + 3 * HOUR_MS);
    expect(computeReminderAt(next)).toBe(next - HOUR_MS);
  });

  it("validates hours range", () => {
    expect(validateHours(3)).toBeNull();
    expect(validateHours(0.1)).toMatch(/between/);
    expect(validateHours(25)).toMatch(/between/);
    expect(validateHours(Number.NaN)).toMatch(/valid/);
  });

  it("returns correct reminder states", () => {
    const next = computeNextMeal(loggedAt, 3);
    const reminder = computeReminderAt(next);

    expect(getReminderState(reminder - 1, reminder, next)).toBe("upcoming");
    expect(getReminderState(reminder, reminder, next)).toBe(
      "inReminderWindow",
    );
    expect(getReminderState(next, reminder, next)).toBe("due");
    expect(getReminderState(next + 2 * HOUR_MS, reminder, next)).toBe(
      "passed",
    );
  });

  it("returns accessible state labels", () => {
    expect(getReminderStateLabel("upcoming")).toBe("Scheduled");
    expect(getReminderStateLabel("inReminderWindow")).toBe("Reminder");
    expect(getReminderStateLabel("due")).toBe("Meal time");
    expect(getReminderStateLabel("passed")).toBe("Passed");
  });

  it("formats countdown labels", () => {
    expect(formatCountdown(90 * 60 * 1000)).toBe("1h 30m");
    expect(formatCountdown(45 * 60 * 1000)).toBe("45m");
    expect(formatCountdown(2 * HOUR_MS)).toBe("2h");
    expect(formatCountdown(0)).toBe("0m");
  });

  it("decides when to notify", () => {
    const next = computeNextMeal(loggedAt, 3);
    const reminder = computeReminderAt(next);
    const inWindow = reminder + 5 * 60 * 1000;

    expect(shouldNotify(inWindow, reminder, next, null)).toBe(true);
    expect(shouldNotify(inWindow, reminder, next, inWindow)).toBe(false);
    expect(shouldNotify(reminder - 1000, reminder, next, null)).toBe(false);
  });
});
