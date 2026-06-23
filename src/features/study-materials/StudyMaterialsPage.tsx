import { type FormEvent, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { createId } from "../../shared/utils/id";
import {
  builtInStudyMaterials,
  normalizeStudyMaterialTitle,
  normalizeStudyMaterialUrl,
  parseStoredStudyMaterials,
  STUDY_MATERIALS_SETTING_KEY,
} from "./studyMaterials";

export function StudyMaterialsPage() {
  const setting = useLiveQuery(() => studyDatabase.settings.get(STUDY_MATERIALS_SETTING_KEY), []);
  const customMaterials = useMemo(() => parseStoredStudyMaterials(setting?.value), [setting?.value]);
  const savingLock = useRef(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function addMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingLock.current) return;

    savingLock.current = true;
    setIsSaving(true);
    setMessage("");

    try {
      const normalizedTitle = normalizeStudyMaterialTitle(title);
      const normalizedUrl = normalizeStudyMaterialUrl(url);
      const existingUrls = new Set([...builtInStudyMaterials, ...customMaterials].map((item) => item.url));

      if (existingUrls.has(normalizedUrl)) {
        setMessage("Το συγκεκριμένο link υπάρχει ήδη.");
        return;
      }

      await studyDatabase.settings.put({
        key: STUDY_MATERIALS_SETTING_KEY,
        value: [
          ...customMaterials,
          { id: createId("material"), title: normalizedTitle, url: normalizedUrl },
        ],
      });

      setTitle("");
      setUrl("");
      setMessage("Το υλικό προστέθηκε.");
    } catch {
      setMessage("Συμπληρώστε όνομα και έγκυρο link HTTP ή HTTPS.");
    } finally {
      savingLock.current = false;
      setIsSaving(false);
    }
  }

  async function removeMaterial(id: string) {
    if (savingLock.current) return;

    savingLock.current = true;
    setIsSaving(true);
    setMessage("");

    try {
      await studyDatabase.settings.put({
        key: STUDY_MATERIALS_SETTING_KEY,
        value: customMaterials.filter((item) => item.id !== id),
      });
      setMessage("Το υλικό διαγράφηκε.");
    } catch {
      setMessage("Η διαγραφή απέτυχε. Δοκιμάστε ξανά.");
    } finally {
      savingLock.current = false;
      setIsSaving(false);
    }
  }

  return (
    <div className="stack-lg">
      <header className="page-heading">
        <p className="eyebrow">External resources</p>
        <h2>Υλικό για μελέτη</h2>
        <p>Ανοίξτε βιβλία, σημειώσεις και άλλα αρχεία που βρίσκονται σε cloud ή server.</p>
      </header>

      <section className="content-panel">
        <h3>Σύνδεσμοι</h3>
        <ul className="material-link-list">
          {[...builtInStudyMaterials, ...customMaterials].map((material) => (
            <li className="material-link-row" key={material.id}>
              <a className="text-link material-link" href={material.url} target="_blank" rel="noopener noreferrer">
                {material.title}
              </a>
              {customMaterials.some((item) => item.id === material.id) && (
                <button
                  className="button danger compact"
                  disabled={isSaving}
                  onClick={() => void removeMaterial(material.id)}
                  type="button"
                >
                  Διαγραφή
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="content-panel">
        <h3>Προσθήκη νέου υλικού</h3>
        <form className="material-form" onSubmit={(event) => void addMaterial(event)}>
          <label className="field-label">
            Όνομα που θα εμφανίζεται
            <input
              required
              maxLength={160}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="π.χ. Σημειώσεις Κεφαλαίου 4"
            />
          </label>
          <label className="field-label">
            Link από cloud ή server
            <input
              required
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://..."
              inputMode="url"
            />
          </label>
          <div className="button-row">
            <button className="button primary" disabled={isSaving} type="submit">Προσθήκη link</button>
          </div>
        </form>
        <p className="inline-message" role="status" aria-live="polite">{message}</p>
      </section>
    </div>
  );
}
