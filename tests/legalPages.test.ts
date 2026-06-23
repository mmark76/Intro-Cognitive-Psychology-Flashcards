import { describe, expect, it } from "vitest";
import { legalPages } from "../src/features/legal/legalPages";

describe("legal footer pages", () => {
  it("provides content for every footer legal link", () => {
    expect(Object.keys(legalPages)).toEqual(["license", "privacy", "analytics", "copyright"]);
  });

  it("states the All Rights Reserved copyright position", () => {
    const licenceText = legalPages.license.sections
      .flatMap((section) => section.paragraphs)
      .join(" ");

    expect(licenceText).toContain("All rights reserved");
    expect(licenceText).toContain("does not make the project open source");
  });

  it("documents tracking cleanup and infrastructure-level analytics separately", () => {
    const analyticsText = legalPages.analytics.sections
      .flatMap((section) => section.paragraphs)
      .join(" ");

    expect(analyticsText).toContain("fbclid");
    expect(analyticsText).toContain("infrastructure level");
    expect(analyticsText).not.toContain("all analytics are disabled");
  });
});
