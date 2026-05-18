import { describe, expect, it, vi, beforeEach } from "vitest";
import { shouldNotify } from "./schedule";

describe("reminder notification window", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-18T15:00:00"));
  });

  it("allows notify inside reminder window only once per 30 min", () => {
    const loggedAt = Date.parse("2026-05-18T12:00:00");
    const nextMealAt = loggedAt + 3 * 60 * 60 * 1000;
    const reminderAt = nextMealAt - 60 * 60 * 1000;
    const now = reminderAt + 10 * 60 * 1000;

    expect(shouldNotify(now, reminderAt, nextMealAt, null)).toBe(true);
    expect(shouldNotify(now, reminderAt, nextMealAt, now)).toBe(false);
  });
});
