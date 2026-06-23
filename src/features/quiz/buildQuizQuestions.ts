import type { Flashcard } from "../../shared/types/models";

export type RandomSource = () => number;

export interface QuizQuestion {
  card: Flashcard;
  options: string[];
}

function normalizeAnswer(answer: string): string {
  return answer
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("el-GR");
}

export function shuffleItems<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomValue = Math.min(Math.max(random(), 0), 1 - Number.EPSILON);
    const targetIndex = Math.floor(randomValue * (index + 1));
    [shuffled[index], shuffled[targetIndex]] = [shuffled[targetIndex], shuffled[index]];
  }

  return shuffled;
}

export function buildQuizQuestions(
  questionPool: readonly Flashcard[],
  answerPool: readonly Flashcard[],
  questionLimit = 10,
  random: RandomSource = Math.random,
): QuizQuestion[] {
  const limit = Math.min(Math.max(Math.floor(questionLimit), 0), questionPool.length);
  const selectedCards = shuffleItems(questionPool, random).slice(0, limit);

  return selectedCards.map((card) => {
    const correctAnswerKey = normalizeAnswer(card.answer);
    const seenAnswerKeys = new Set([correctAnswerKey]);
    const distractors: string[] = [];

    for (const candidate of shuffleItems(answerPool, random)) {
      const candidateKey = normalizeAnswer(candidate.answer);

      if (candidate.id === card.id || seenAnswerKeys.has(candidateKey)) {
        continue;
      }

      seenAnswerKeys.add(candidateKey);
      distractors.push(candidate.answer);

      if (distractors.length === 3) {
        break;
      }
    }

    return {
      card,
      options: shuffleItems([card.answer, ...distractors], random),
    };
  });
}
