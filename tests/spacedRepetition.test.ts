import { describe, expect, it } from "vitest";
import { calculateNextProgress, isDue } from "../src/features/review/spacedRepetition";

const reviewedAt = new Date("2026-06-22T10:00:00.000Z");

describe("calculateNextProgress", () => {
  it("schedules a forgotten card after ten minutes and records a lapse", () => {
    const result = calculateNextProgress("card-001", undefined, 0, reviewedAt);
    expect(result.intervalDays).toBe(0);
    expect(result.repetitions).toBe(0);
    expect(result.lapses).toBe(1);
    expect(result.nextReviewAt).toBe("2026-06-22T10:10:00.000Z");
  });

  it("schedules a partial answer after one day", () => {
    const result = calculateNextProgress("card-001", undefined, 1, reviewedAt);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it("schedules a full first answer after three days", () => {
    const result = calculateNextProgress("card-001", undefined, 2, reviewedAt);
    expect(result.intervalDays).toBe(3);
    expect(result.repetitions).toBe(1);
  });
});

describe("isDue", () => {
  it("returns true when next review is in the past", () => {
    const progress = calculateNextProgress("card-001", undefined, 0, reviewedAt);
    expect(isDue(progress, new Date("2026-06-22T10:11:00.000Z"))).toBe(true);
  });
});
