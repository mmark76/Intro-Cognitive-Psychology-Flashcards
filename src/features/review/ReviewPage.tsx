import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { flashcards } from "../../data";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { EmptyState } from "../../shared/components/EmptyState";
import { FlashcardSession } from "../flashcards/FlashcardSession";

export function ReviewPage() {
  const dueProgress = useLiveQuery(
    () => studyDatabase.cardProgress.where("nextReviewAt").belowOrEqual(new Date().toISOString()).toArray(),
  );
  const [sessionCardIds, setSessionCardIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (sessionCardIds === null && dueProgress !== undefined) {
      setSessionCardIds(dueProgress.map((item) => item.cardId));
    }
  }, [dueProgress, sessionCardIds]);

  if (sessionCardIds === null) {
    return <EmptyState title="Φόρτωση επανάληψης">Ανακτάται η τοπική πρόοδος της μελέτης.</EmptyState>;
  }

  const dueIds = new Set(sessionCardIds);
  const cards = flashcards.filter((card) => dueIds.has(card.id));

  if (cards.length === 0) {
    return <EmptyState title="Δεν υπάρχουν κάρτες για επανάληψη">Μελετήστε νέες κάρτες ή επιστρέψτε όταν φτάσει η επόμενη προγραμματισμένη επανάληψη.</EmptyState>;
  }

  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Spaced retrieval</p>
        <h2>Οφειλόμενη επανάληψη</h2>
        <p>{cards.length} κάρτες είναι έτοιμες για επανάληψη.</p>
      </header>
      <FlashcardSession cards={cards} mode="review" />
    </div>
  );
}
