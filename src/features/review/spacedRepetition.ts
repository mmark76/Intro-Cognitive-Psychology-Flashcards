import type { CardProgress, Rating } from "../../shared/types/models";

const DAY_MS = 24 * 60 * 60 * 1000;
const TEN_MINUTES_MS = 10 * 60 * 1000;
const MAX_INTERVAL_DAYS = 180;

export function calculateNextProgress(
  cardId: string,
  current: CardProgress | undefined,
  score: Rating,
  reviewedAt = new Date(),
): CardProgress {
  if (score === 0) {
    return {
      cardId,
      score,
      repetitions: 0,
      intervalDays: 0,
      nextReviewAt: new Date(reviewedAt.getTime() + TEN_MINUTES_MS).toISOString(),
      lastReviewedAt: reviewedAt.toISOString(),
      lapses: (current?.lapses ?? 0) + 1,
    };
  }

  const repetitions = (current?.repetitions ?? 0) + 1;
  const previousInterval = current?.intervalDays ?? 0;
  const intervalDays = score === 1
    ? Math.min(MAX_INTERVAL_DAYS, previousInterval <= 1 ? 1 : Math.ceil(previousInterval * 1.8))
    : Math.min(
        MAX_INTERVAL_DAYS,
        repetitions === 1 ? 3 : repetitions === 2 ? 7 : Math.ceil(Math.max(1, previousInterval) * 2.5),
      );

  return {
    cardId,
    score,
    repetitions,
    intervalDays,
    nextReviewAt: new Date(reviewedAt.getTime() + intervalDays * DAY_MS).toISOString(),
    lastReviewedAt: reviewedAt.toISOString(),
    lapses: current?.lapses ?? 0,
  };
}

export function isDue(progress: CardProgress, now = new Date()): boolean {
  return new Date(progress.nextReviewAt).getTime() <= now.getTime();
}
