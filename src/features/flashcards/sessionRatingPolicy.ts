import type { Rating } from "../../shared/types/models";

export interface SessionRatingDecision {
  persistProgress: boolean;
  requeueCard: boolean;
}

export function getSessionRatingDecision(
  score: Rating,
  hasPersistedRating: boolean,
  hasBeenRequeued: boolean,
): SessionRatingDecision {
  const persistProgress = !hasPersistedRating;

  return {
    persistProgress,
    requeueCard: persistProgress && score === 0 && !hasBeenRequeued,
  };
}
