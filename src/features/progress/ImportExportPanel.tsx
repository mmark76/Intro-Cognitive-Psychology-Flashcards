import { useRef, useState } from "react";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import type { StudyBackup } from "../../shared/types/models";

export function ImportExportPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  async function exportBackup() {
    const backup: StudyBackup = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      cardProgress: await studyDatabase.cardProgress.toArray(),
      studySessions: await studyDatabase.studySessions.toArray(),
      settings: await studyDatabase.settings.toArray(),
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `cognitive-psychology-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Το αντίγραφο ασφαλείας δημιουργήθηκε.");
  }

  async function importBackup(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as StudyBackup;
      if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.cardProgress) || !Array.isArray(parsed.studySessions)) {
        throw new Error("Μη συμβατό αρχείο");
      }
      await studyDatabase.transaction("rw", studyDatabase.cardProgress, studyDatabase.studySessions, studyDatabase.settings, async () => {
        await studyDatabase.cardProgress.clear();
        await studyDatabase.studySessions.clear();
        await studyDatabase.settings.clear();
        await studyDatabase.cardProgress.bulkPut(parsed.cardProgress);
        await studyDatabase.studySessions.bulkPut(parsed.studySessions);
        await studyDatabase.settings.bulkPut(parsed.settings ?? []);
      });
      setMessage("Η πρόοδος εισήχθη επιτυχώς.");
    } catch {
      setMessage("Το αρχείο δεν είναι έγκυρο αντίγραφο της εφαρμογής.");
    }
  }

  return (
    <section className="content-panel">
      <h3>Αντίγραφο ασφαλείας</h3>
      <p>Εξαγωγή και επαναφορά της τοπικής προόδου σε αρχείο JSON.</p>
      <div className="button-row">
        <button className="button secondary" onClick={() => void exportBackup()}>Εξαγωγή</button>
        <button className="button secondary" onClick={() => inputRef.current?.click()}>Εισαγωγή</button>
      </div>
      <input ref={inputRef} type="file" accept="application/json" hidden onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) void importBackup(file);
        event.currentTarget.value = "";
      }} />
      {message && <p className="inline-message" role="status">{message}</p>}
    </section>
  );
}
