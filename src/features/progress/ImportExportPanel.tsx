import { useRef, useState } from "react";
import { flashcards } from "../../data";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import type { StudyBackup } from "../../shared/types/models";
import { parseStudyBackup } from "./backupValidation";

const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const VALID_CARD_IDS = new Set(flashcards.map((card) => card.id));

export function ImportExportPanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function exportBackup() {
    if (isBusy) return;
    setIsBusy(true);
    setMessage("");

    try {
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
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage("Το αντίγραφο ασφαλείας δημιουργήθηκε.");
    } catch {
      setMessage("Η δημιουργία του αντιγράφου ασφαλείας απέτυχε.");
    } finally {
      setIsBusy(false);
    }
  }

  async function importBackup(file: File) {
    if (isBusy) return;
    setIsBusy(true);
    setMessage("");

    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("Backup file is too large");
      const parsed: unknown = JSON.parse(await file.text());
      const backup = parseStudyBackup(parsed, VALID_CARD_IDS);

      await studyDatabase.transaction("rw", studyDatabase.cardProgress, studyDatabase.studySessions, studyDatabase.settings, async () => {
        await studyDatabase.cardProgress.clear();
        await studyDatabase.studySessions.clear();
        await studyDatabase.settings.clear();
        await studyDatabase.cardProgress.bulkPut(backup.cardProgress);
        await studyDatabase.studySessions.bulkPut(backup.studySessions);
        await studyDatabase.settings.bulkPut(backup.settings);
      });
      setMessage("Η πρόοδος εισήχθη επιτυχώς.");
    } catch {
      setMessage("Το αρχείο δεν είναι έγκυρο αντίγραφο της εφαρμογής.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="content-panel">
      <h3>Αντίγραφο ασφαλείας</h3>
      <p>Εξαγωγή και επαναφορά της τοπικής προόδου σε αρχείο JSON.</p>
      <div className="button-row">
        <button className="button secondary" disabled={isBusy} onClick={() => void exportBackup()}>Εξαγωγή</button>
        <button className="button secondary" disabled={isBusy} onClick={() => inputRef.current?.click()}>Εισαγωγή</button>
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
