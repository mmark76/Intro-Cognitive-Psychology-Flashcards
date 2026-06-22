import { describe, expect, it } from "vitest";
import { getSessionRatingDecision } from "../src/features/flashcards/sessionRatingPolicy";

describe("getSessionRatingDecision", () => {
  it("persists and requeues the first score-zero rating", () => {
    expect(getSessionRatingDecision(0, false, false)).toEqual({
      persistProgress: true,
      requeueCard: true,
    });
  });

  it("does not overwrite progress when the requeued card is rated again", () => {
    expect(getSessionRatingDecision(2, true, true)).toEqual({
      persistProgress: false,
      requeueCard: false,
    });
  });

  it("persists a first-pass successful rating without requeueing", () => {
    expect(getSessionRatingDecision(2, false, false)).toEqual({
      persistProgress: true,
      requeueCard: false,
    });
  });
});
