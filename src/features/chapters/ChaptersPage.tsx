import { Link } from "react-router-dom";
import { chapters, flashcards } from "../../data";

export function ChaptersPage() {
  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">16 thematic chapters</p>
        <h2>Κεφάλαια</h2>
        <p>Μαθησιακοί στόχοι, βασική σύνοψη, όροι και άμεση πρόσβαση στις αντίστοιχες κάρτες.</p>
      </header>
      <div className="chapter-grid">
        {chapters.map((chapter) => {
          const count = flashcards.filter((card) => card.chapterId === chapter.id).length;
          return (
            <article className="chapter-card" key={chapter.id}>
              <p className="chapter-number">Κεφάλαιο {chapter.number}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.summary[0]}</p>
              <details>
                <summary>Στόχοι και σύνοψη</summary>
                <h4>Μαθησιακοί στόχοι</h4>
                <ul>{chapter.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
                <h4>Σύνοψη</h4>
                <ul>{chapter.summary.map((item) => <li key={item}>{item}</li>)}</ul>
                <div className="tag-list">
                  {chapter.keyTerms.map((term) => <span className="tag" key={term}>{term}</span>)}
                </div>
              </details>
              <Link className="text-link" to={`/flashcards?chapter=${chapter.number}`}>
                Μελέτη {count} καρτών →
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
