import { describe, expect, it } from "vitest";
import { chapters, flashcards } from "../src/data";

describe("study content", () => {
  it("contains 16 chapters and 100 uniquely numbered flashcards", () => {
    expect(chapters).toHaveLength(16);
    expect(flashcards).toHaveLength(100);
    expect(new Set(flashcards.map((card) => card.id)).size).toBe(100);
    expect(flashcards.map((card) => card.number)).toEqual(Array.from({ length: 100 }, (_, index) => index + 1));
  });

  it("links every flashcard to an existing chapter", () => {
    const chapterIds = new Set(chapters.map((chapter) => chapter.id));
    expect(flashcards.every((card) => chapterIds.has(card.chapterId))).toBe(true);
  });
});
