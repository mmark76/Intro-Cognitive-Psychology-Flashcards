import { useMemo, useRef, useState } from "react";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import type { Flashcard, Rating, StudyMode } from "../../shared/types/models";
import { createId } from "../../shared/utils/id";
import { calculateNextProgress } from "../review/spacedRepetition";
import { getSessionRatingDecision } from "./sessionRatingPolicy";

interface FlashcardSessionProps {
  cards: Flashcard[];
  mode: Extract<StudyMode, "flashcards" | "review">;
  onComplete?: () => void;
}

export function FlashcardSession({ cards, mode, onComplete }: FlashcardSessionProps) {
  const initialIds = useMemo(() => cards.map((card) => card.id), [cards]);
  const [queue, setQueue] = useState(initialIds);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const persistedRatings = useRef(new Set<string>());
  const requeued = useRef(new Set<string>());
  const startedAt = useRef(new Date().toISOString());

  const cardById = useMemo(() => new Map(cards.map((card) => [card.id, card])), [cards]);
  const current = cardById.get(queue[index]);

  async function rate(score: Rating) {
    if (!current) return;

    const decision = getSessionRatingDecision(
      score,
      persistedRatings.current.has(current.id),
      requeued.current.has(current.id),
    );

    if (decision.persistProgress) {
      const existing = await studyDatabase.cardProgress.get(current.id);
      await studyDatabase.cardProgress.put(calculateNextProgress(current.id, existing, score));
      persistedRatings.current.add(current.id);
    }

    const isFirstPassCorrect = decision.persistProgress && score === 2;
    if (isFirstPassCorrect) setCorrectAnswers((value) => value + 1);

    if (decision.requeueCard) {
      requeued.current.add(current.id);
      setQueue((items) => [...items, current.id]);
    }

    const nextIndex = index + 1;
    if (nextIndex >= queue.length + (decision.requeueCard ? 1 : 0)) {
      await studyDatabase.studySessions.put({
        id: createId("session"),
        mode,
        startedAt: startedAt.current,
        completedAt: new Date().toISOString(),
        reviewedCards: nextIndex,
        correctAnswers: correctAnswers + (isFirstPassCorrect ? 1 : 0),
      });
      onComplete?.();
    }

    setIndex(nextIndex);
    setRevealed(false);
  }

  if (!current) {
    return (
      <section className="content-panel centered">
        <h2>Η συνεδρία ολοκληρώθηκε</h2>
        <p>Απαντήσατε σε {index} παρουσιάσεις καρτών.</p>
      </section>
    );
  }

  return (
    <section className="study-panel">
      <div className="session-progress">
        <span>Κάρτα {Math.min(index + 1, queue.length)} / {queue.length}</span>
        <progress value={index} max={queue.length} />
      </div>
      <article className={`flashcard ${revealed ? "revealed" : ""}`}>
        <p className="eyebrow">Κάρτα {current.number.toString().padStart(3, "0")}</p>
        <h2>{current.question}</h2>
        {revealed ? (
          <div className="answer-panel">
            <p>{current.answer}</p>
          </div>
        ) : (
          <button className="button primary" onClick={() => setRevealed(true)}>Αποκάλυψη απάντησης</button>
        )}
      </article>
      {revealed && (
        <div className="rating-grid" aria-label="Αυτοβαθμολόγηση">
          <button onClick={() => void rate(0)}><strong>0</strong><span>Δεν θυμάμαι</span></button>
          <button onClick={() => void rate(1)}><strong>1</strong><span>Μερική απάντηση</span></button>
          <button onClick={() => void rate(2)}><strong>2</strong><span>Πλήρης απάντηση</span></button>
        </div>
      )}
    </section>
  );
}
