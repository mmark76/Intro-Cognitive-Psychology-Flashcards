import type { AppSetting, CardProgress, StudyBackup, StudySession } from "../../shared/types/models";

const MAX_RECORDS_PER_COLLECTION = 10_000;
const STUDY_MODES = new Set(["flashcards", "quiz", "review"]);

function assertValid(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0;
}

function assertCollectionSize(items: unknown[], name: string) {
  assertValid(items.length <= MAX_RECORDS_PER_COLLECTION, `${name} exceeds the supported size`);
}

function parseCardProgress(value: unknown, validCardIds: ReadonlySet<string>): CardProgress {
  assertValid(isRecord(value), "Invalid card progress record");
  assertValid(isNonEmptyString(value.cardId) && validCardIds.has(value.cardId), "Unknown card ID");
  assertValid(value.score === 0 || value.score === 1 || value.score === 2, "Invalid score");
  assertValid(isNonNegativeInteger(value.repetitions), "Invalid repetitions");
  assertValid(isNonNegativeInteger(value.intervalDays), "Invalid interval");
  assertValid(isIsoDate(value.nextReviewAt), "Invalid next-review date");
  assertValid(isIsoDate(value.lastReviewedAt), "Invalid last-reviewed date");
  assertValid(isNonNegativeInteger(value.lapses), "Invalid lapses");

  return {
    cardId: value.cardId,
    score: value.score,
    repetitions: value.repetitions,
    intervalDays: value.intervalDays,
    nextReviewAt: value.nextReviewAt,
    lastReviewedAt: value.lastReviewedAt,
    lapses: value.lapses,
  };
}

function parseStudySession(value: unknown): StudySession {
  assertValid(isRecord(value), "Invalid study session");
  assertValid(isNonEmptyString(value.id), "Invalid session ID");
  assertValid(typeof value.mode === "string" && STUDY_MODES.has(value.mode), "Invalid study mode");
  assertValid(isIsoDate(value.startedAt), "Invalid session start date");
  assertValid(value.completedAt === undefined || isIsoDate(value.completedAt), "Invalid session completion date");
  assertValid(isNonNegativeInteger(value.reviewedCards), "Invalid reviewed-card count");
  assertValid(isNonNegativeInteger(value.correctAnswers), "Invalid correct-answer count");
  assertValid(value.correctAnswers <= value.reviewedCards, "Correct answers exceed reviewed cards");

  return {
    id: value.id,
    mode: value.mode as StudySession["mode"],
    startedAt: value.startedAt,
    completedAt: value.completedAt,
    reviewedCards: value.reviewedCards,
    correctAnswers: value.correctAnswers,
  };
}

function parseSetting(value: unknown): AppSetting {
  assertValid(isRecord(value), "Invalid setting");
  assertValid(isNonEmptyString(value.key), "Invalid setting key");
  return { key: value.key, value: value.value };
}

function assertUnique(items: string[], name: string) {
  assertValid(new Set(items).size === items.length, `Duplicate ${name}`);
}

export function parseStudyBackup(value: unknown, validCardIds: ReadonlySet<string>): StudyBackup {
  assertValid(isRecord(value), "Backup must be a JSON object");
  assertValid(value.schemaVersion === 1, "Unsupported backup version");
  assertValid(isIsoDate(value.exportedAt), "Invalid export date");
  assertValid(Array.isArray(value.cardProgress), "Invalid card-progress collection");
  assertValid(Array.isArray(value.studySessions), "Invalid study-session collection");

  const settingsSource = value.settings ?? [];
  assertValid(Array.isArray(settingsSource), "Invalid settings collection");
  assertCollectionSize(value.cardProgress, "cardProgress");
  assertCollectionSize(value.studySessions, "studySessions");
  assertCollectionSize(settingsSource, "settings");

  const cardProgress = value.cardProgress.map((item) => parseCardProgress(item, validCardIds));
  const studySessions = value.studySessions.map(parseStudySession);
  const settings = settingsSource.map(parseSetting);

  assertUnique(cardProgress.map((item) => item.cardId), "card progress ID");
  assertUnique(studySessions.map((item) => item.id), "session ID");
  assertUnique(settings.map((item) => item.key), "setting key");

  return {
    schemaVersion: 1,
    exportedAt: value.exportedAt,
    cardProgress,
    studySessions,
    settings,
  };
}
