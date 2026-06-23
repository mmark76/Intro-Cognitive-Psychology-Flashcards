import { describe, expect, it } from "vitest";
import { buildQuizQuestions } from "../src/features/quiz/buildQuizQuestions";
import type { Flashcard } from "../src/shared/types/models";

function createCard(id: string, answer: string): Flashcard {
  return {
    id,
    chapterId: "chapter-01",
    number: Number(id.replace(/\D/g, "")) || 1,
    question: `Question ${id}`,
    answer,
    tags: [],
  };
}

function normalize(answer: string): string {
  return answer.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("el-GR");
}

describe("quiz question generation", () => {
  it("keeps exactly one correct answer and removes duplicate distractors", () => {
    const correct = createCard("card-001", " Same answer ");
    const cards = [
      correct,
      createCard("card-002", "same   answer"),
      createCard("card-003", "Distractor A"),
      createCard("card-004", "Distractor B"),
      createCard("card-005", " distractor b "),
      createCard("card-006", "Distractor C"),
    ];

    const [question] = buildQuizQuestions([correct], cards, 1, () => 0);
    const normalizedOptions = question.options.map(normalize);

    expect(question.options).toHaveLength(4);
    expect(new Set(normalizedOptions).size).toBe(question.options.length);
    expect(normalizedOptions.filter((option) => option === normalize(correct.answer))).toHaveLength(1);
  });

  it("uses fewer options when there are not enough unique distractors", () => {
    const correct = createCard("card-001", "Correct");
    const cards = [
      correct,
      createCard("card-002", " correct "),
      createCard("card-003", "Only distractor"),
    ];

    const [question] = buildQuizQuestions([correct], cards, 1, () => 0.5);

    expect(question.options).toHaveLength(2);
    expect(new Set(question.options.map(normalize)).size).toBe(2);
  });

  it("respects the question limit without mutating the source arrays", () => {
    const cards = [
      createCard("card-001", "Answer A"),
      createCard("card-002", "Answer B"),
      createCard("card-003", "Answer C"),
      createCard("card-004", "Answer D"),
    ];
    const originalIds = cards.map((card) => card.id);

    const questions = buildQuizQuestions(cards, cards, 2, () => 0.25);

    expect(questions).toHaveLength(2);
    expect(cards.map((card) => card.id)).toEqual(originalIds);
  });
});
