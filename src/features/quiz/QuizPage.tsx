import { useMemo, useRef, useState } from "react";
import { chapters, flashcards } from "../../data";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { createId } from "../../shared/utils/id";
import { buildQuizQuestions } from "./buildQuizQuestions";

export function QuizPage() {
  const [chapter, setChapter] = useState(0);
  const [version, setVersion] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const advancingLock = useRef(false);
  const startedAt = useRef(new Date().toISOString());

  const questions = useMemo(() => {
    const pool = chapter === 0 ? flashcards : flashcards.filter((card) => card.chapterId === `chapter-${chapter.toString().padStart(2, "0")}`);
    return buildQuizQuestions(pool, flashcards);
  }, [chapter, version]);

  const current = questions[index];

  function restart(nextChapter = chapter) {
    if (advancingLock.current) return;
    setChapter(nextChapter);
    setVersion((value) => value + 1);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setError("");
    startedAt.current = new Date().toISOString();
  }

  async function next() {
    if (!current || selected === null || advancingLock.current) return;
    advancingLock.current = true;
    setIsSaving(true);
    setError("");

    try {
      const isCorrect = selected === current.card.answer;
      const nextScore = score + (isCorrect ? 1 : 0);
      if (index + 1 >= questions.length) {
        await studyDatabase.studySessions.put({
          id: createId("session"),
          mode: "quiz",
          startedAt: startedAt.current,
          completedAt: new Date().toISOString(),
          reviewedCards: questions.length,
          correctAnswers: nextScore,
        });
      }
      setScore(nextScore);
      setIndex((value) => value + 1);
      setSelected(null);
    } catch {
      setError("Η αποθήκευση του quiz απέτυχε. Δοκιμάστε ξανά.");
    } finally {
      advancingLock.current = false;
      setIsSaving(false);
    }
  }

  if (!current) {
    return (
      <div className="stack-lg">
        <header className="page-heading"><p className="eyebrow">Self-assessment</p><h2>Quiz ολοκληρώθηκε</h2></header>
        <section className="content-panel centered">
          <p className="quiz-result">{score} / {questions.length}</p>
          <button className="button primary" onClick={() => restart()}>Νέο quiz</button>
        </section>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">Multiple choice · 10 questions</p>
        <h2>Quiz</h2>
        <label className="field-label">Κεφάλαιο
          <select disabled={isSaving} value={chapter} onChange={(event) => restart(Number(event.target.value))}>
            <option value={0}>Όλα τα κεφάλαια</option>
            {chapters.map((item) => <option value={item.number} key={item.id}>{item.number}. {item.title}</option>)}
          </select>
        </label>
      </header>
      <section className="quiz-card">
        <p className="eyebrow">Ερώτηση {index + 1} / {questions.length}</p>
        <h2>{current.card.question}</h2>
        <div className="option-list">
          {current.options.map((option) => {
            const chosen = selected === option;
            const correct = selected !== null && option === current.card.answer;
            const wrong = chosen && !correct;
            return <button className={`${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} disabled={selected !== null || isSaving} onClick={() => setSelected(option)} key={option}>{option}</button>;
          })}
        </div>
        {selected !== null && <button className="button primary" disabled={isSaving} onClick={() => void next()}>{index + 1 === questions.length ? "Ολοκλήρωση" : "Επόμενη"}</button>}
        {error && <p className="inline-message" role="alert">{error}</p>}
      </section>
    </div>
  );
}
