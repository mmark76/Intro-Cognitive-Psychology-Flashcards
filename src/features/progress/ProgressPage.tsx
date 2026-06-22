import { useLiveQuery } from "dexie-react-hooks";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { formatDateTime } from "../../shared/utils/date";
import { ImportExportPanel } from "./ImportExportPanel";

export function ProgressPage() {
  const progress = useLiveQuery(() => studyDatabase.cardProgress.toArray(), [], []);
  const sessions = useLiveQuery(() => studyDatabase.studySessions.orderBy("startedAt").reverse().limit(10).toArray(), [], []);
  const due = progress.filter((item) => new Date(item.nextReviewAt) <= new Date()).length;
  const mastered = progress.filter((item) => item.score === 2).length;
  const average = progress.length === 0 ? 0 : progress.reduce((sum, item) => sum + item.score, 0) / progress.length;

  async function reset() {
    if (!window.confirm("Να διαγραφεί οριστικά όλη η τοπική πρόοδος;")) return;
    await studyDatabase.delete();
    window.location.reload();
  }

  return (
    <div className="stack-lg">
      <header className="page-heading"><p className="eyebrow">Local analytics</p><h2>Πρόοδος</h2></header>
      <section className="stat-grid">
        <article className="stat-card"><strong>{progress.length}</strong><span>μελετημένες κάρτες</span></article>
        <article className="stat-card"><strong>{mastered}</strong><span>τελευταία βαθμολογία 2</span></article>
        <article className="stat-card"><strong>{due}</strong><span>οφειλόμενες</span></article>
        <article className="stat-card"><strong>{average.toFixed(1)}</strong><span>μέση βαθμολογία</span></article>
      </section>
      <section className="content-panel">
        <h3>Πρόσφατες συνεδρίες</h3>
        {sessions.length === 0 ? <p>Δεν υπάρχουν ολοκληρωμένες συνεδρίες.</p> : (
          <div className="table-scroll"><table><thead><tr><th>Ημερομηνία</th><th>Τύπος</th><th>Κάρτες</th><th>Πλήρεις/σωστές</th></tr></thead><tbody>
            {sessions.map((session) => <tr key={session.id}><td>{formatDateTime(session.startedAt)}</td><td>{session.mode}</td><td>{session.reviewedCards}</td><td>{session.correctAnswers}</td></tr>)}
          </tbody></table></div>
        )}
      </section>
      <ImportExportPanel />
      <section className="content-panel danger-zone"><h3>Διαγραφή προόδου</h3><p>Η ενέργεια επηρεάζει μόνο τα δεδομένα αυτής της συσκευής.</p><button className="button danger" onClick={() => void reset()}>Διαγραφή όλων</button></section>
    </div>
  );
}
