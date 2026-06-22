import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { chapters, flashcards } from "../../data";
import { FlashcardSession } from "./FlashcardSession";

export function FlashcardsPage() {
  const [params, setParams] = useSearchParams();
  const chapterNumber = Number(params.get("chapter") ?? 0);
  const selected = Number.isInteger(chapterNumber) && chapterNumber >= 1 && chapterNumber <= chapters.length
    ? chapterNumber
    : 0;
  const cards = useMemo(
    () => selected === 0 ? flashcards : flashcards.filter((card) => card.chapterId === `chapter-${selected.toString().padStart(2, "0")}`),
    [selected],
  );

  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Active recall</p>
        <h2>Flashcards</h2>
        <label className="field-label">
          Επιλογή κεφαλαίου
          <select value={selected} onChange={(event) => setParams(event.target.value === "0" ? {} : { chapter: event.target.value })}>
            <option value={0}>Όλα τα κεφάλαια · 100 κάρτες</option>
            {chapters.map((chapter) => <option key={chapter.id} value={chapter.number}>{chapter.number}. {chapter.title}</option>)}
          </select>
        </label>
      </header>
      <FlashcardSession key={selected} cards={cards} mode="flashcards" />
    </div>
  );
}
