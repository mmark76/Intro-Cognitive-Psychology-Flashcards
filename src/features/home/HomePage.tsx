import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { chapters, flashcards } from "../../data";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";

export function HomePage() {
  const progress = useLiveQuery(() => studyDatabase.cardProgress.toArray(), [], []);
  const due = progress.filter((item) => new Date(item.nextReviewAt) <= new Date()).length;
  const mastered = progress.filter((item) => item.score === 2).length;

  return (
    <div className="stack-lg">
      <section className="hero-panel">
        <p className="eyebrow">Active recall · Spaced retrieval · Offline study</p>
        <h2>Μελέτη με ενεργητική ανάκληση</h2>
        <p>
          Μελετήστε τις βασικές ιδέες των 16 κεφαλαίων, απαντήστε στις 100 κάρτες και επαναλάβετε
          τις δύσκολες έννοιες στον κατάλληλο χρόνο.
        </p>
        <div className="button-row">
          <Link className="button primary" to="/flashcards">Έναρξη flashcards</Link>
          <Link className="button secondary" to="/review">Οφειλόμενη επανάληψη</Link>
        </div>
      </section>
      <section className="stat-grid" aria-label="Σύνοψη προόδου">
        <article className="stat-card"><strong>{chapters.length}</strong><span>κεφάλαια</span></article>
        <article className="stat-card"><strong>{flashcards.length}</strong><span>flashcards</span></article>
        <article className="stat-card"><strong>{progress.length}</strong><span>μελετημένες</span></article>
        <article className="stat-card"><strong>{mastered}</strong><span>πλήρεις απαντήσεις</span></article>
        <article className="stat-card"><strong>{due}</strong><span>για επανάληψη</span></article>
      </section>
      <section className="content-panel">
        <h2>Προτεινόμενος κύκλος</h2>
        <ol className="study-cycle">
          <li>Διαβάστε τους στόχους και τη σύνοψη ενός κεφαλαίου.</li>
          <li>Απαντήστε στις κάρτες πριν αποκαλύψετε τη λύση.</li>
          <li>Βαθμολογήστε ειλικρινά: 0, 1 ή 2.</li>
          <li>Επιστρέψτε στην οφειλόμενη επανάληψη και δοκιμάστε quiz.</li>
        </ol>
      </section>
    </div>
  );
}
