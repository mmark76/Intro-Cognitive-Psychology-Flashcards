import { describe, expect, it } from "vitest";
import {
  normalizeStudyMaterialTitle,
  normalizeStudyMaterialUrl,
  parseStoredStudyMaterials,
} from "../src/features/study-materials/studyMaterials";

describe("study material links", () => {
  it("accepts HTTP and HTTPS cloud or server links", () => {
    expect(normalizeStudyMaterialUrl(" https://example.com/files/notes.pdf ")).toBe("https://example.com/files/notes.pdf");
    expect(normalizeStudyMaterialUrl("http://server.local/resource")).toBe("http://server.local/resource");
  });

  it("rejects unsupported or unsafe URL protocols", () => {
    expect(() => normalizeStudyMaterialUrl("javascript:alert(1)")).toThrow();
    expect(() => normalizeStudyMaterialUrl("ftp://example.com/file.pdf")).toThrow();
    expect(() => normalizeStudyMaterialUrl("/relative/path")).toThrow();
  });

  it("normalizes the visible title without exposing the URL", () => {
    expect(normalizeStudyMaterialTitle("  Σημειώσεις   Κεφαλαίου 4  ")).toBe("Σημειώσεις Κεφαλαίου 4");
  });

  it("ignores malformed saved records and duplicate IDs", () => {
    const materials = parseStoredStudyMaterials([
      { id: "one", title: "Πρώτο", url: "https://example.com/one" },
      { id: "one", title: "Διπλό", url: "https://example.com/two" },
      { id: "bad", title: "Μη ασφαλές", url: "javascript:alert(1)" },
      null,
    ]);

    expect(materials).toEqual([
      { id: "one", title: "Πρώτο", url: "https://example.com/one" },
    ]);
  });
});
