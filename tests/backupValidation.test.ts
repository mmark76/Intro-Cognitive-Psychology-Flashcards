import { describe, expect, it } from "vitest";
import { parseStudyBackup } from "../src/features/progress/backupValidation";

const validCardIds = new Set(["card-001"]);

function validBackup() {
  return {
    schemaVersion: 1,
    exportedAt: "2026-06-22T10:00:00.000Z",
    cardProgress: [{
      cardId: "card-001",
      score: 2,
      repetitions: 1,
      intervalDays: 3,
      nextReviewAt: "2026-06-25T10:00:00.000Z",
      lastReviewedAt: "2026-06-22T10:00:00.000Z",
      lapses: 0,
    }],
    studySessions: [{
      id: "session-1",
      mode: "quiz",
      startedAt: "2026-06-22T10:00:00.000Z",
      completedAt: "2026-06-22T10:05:00.000Z",
      reviewedCards: 10,
      correctAnswers: 8,
    }],
    settings: [{ key: "theme", value: "system" }],
  };
}

describe("backup validation", () => {
  it("accepts a valid backup", () => {
    expect(parseStudyBackup(validBackup(), validCardIds)).toEqual(validBackup());
  });

  it("rejects unknown card IDs", () => {
    const backup = validBackup();
    backup.cardProgress[0].cardId = "unknown";
    expect(() => parseStudyBackup(backup, validCardIds)).toThrow("Unknown card ID");
  });

  it("rejects invalid ratings and dates", () => {
    const backup = validBackup();
    backup.cardProgress[0].score = 3;
    backup.cardProgress[0].nextReviewAt = "not-a-date";
    expect(() => parseStudyBackup(backup, validCardIds)).toThrow("Invalid score");
  });

  it("rejects duplicate primary keys", () => {
    const backup = validBackup();
    backup.cardProgress.push({ ...backup.cardProgress[0] });
    expect(() => parseStudyBackup(backup, validCardIds)).toThrow("Duplicate card progress ID");
  });
});
