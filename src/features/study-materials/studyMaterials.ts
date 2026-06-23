export interface StudyMaterialLink {
  id: string;
  title: string;
  url: string;
}

export const STUDY_MATERIALS_SETTING_KEY = "study-material-links";

export const builtInStudyMaterials: readonly StudyMaterialLink[] = [
  {
    id: "introduction-cognitive-psychology-gr",
    title: "Εισαγωγή στη Γνωστική Ψυχολογία",
    url: "https://drive.google.com/file/d/1G-k3_Aqvqw6ZyABkmiDVvVu-7QbRDR3c/view?usp=drive_link",
  },
  {
    id: "goldstein-hale-cognitive-psychology",
    title: "Cognitive Psychology — E. Bruce Goldstein & Ralph G. Hale",
    url: "https://drive.google.com/file/d/1I-1cx-d5VhacA06uj-Z_dVSYgRpVsnGs/view?usp=drive_link",
  },
  {
    id: "introduction-cognitive-psychology-100-flashcards-gr",
    title: "100 Flashcards — Εισαγωγή στη Γνωστική Ψυχολογία",
    url: "https://drive.google.com/file/d/1RyldWVOLe8EK60iLed0VZsWlHNfEONep/view?usp=drive_link",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeStudyMaterialUrl(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 2_048) {
    throw new Error("Invalid URL length");
  }

  const url = new URL(trimmed);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only HTTP and HTTPS links are supported");
  }

  return url.toString();
}

export function normalizeStudyMaterialTitle(value: string): string {
  const title = value.trim().replace(/\s+/g, " ");
  if (title.length === 0 || title.length > 160) {
    throw new Error("Invalid title length");
  }
  return title;
}

export function parseStoredStudyMaterials(value: unknown): StudyMaterialLink[] {
  if (!Array.isArray(value)) return [];

  const materials: StudyMaterialLink[] = [];
  const seenIds = new Set<string>();

  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== "string" || typeof item.title !== "string" || typeof item.url !== "string") {
      continue;
    }

    try {
      const id = item.id.trim();
      if (id.length === 0 || seenIds.has(id)) continue;

      materials.push({
        id,
        title: normalizeStudyMaterialTitle(item.title),
        url: normalizeStudyMaterialUrl(item.url),
      });
      seenIds.add(id);
    } catch {
      // Ignore malformed local records instead of breaking the page.
    }
  }

  return materials;
}
