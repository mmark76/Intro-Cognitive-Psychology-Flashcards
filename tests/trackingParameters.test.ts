import { describe, expect, it } from "vitest";
import { getUrlWithoutTrackingParameters } from "../src/shared/utils/trackingParameters";

describe("tracking parameter cleanup", () => {
  it("removes Facebook, Google and UTM tracking parameters while preserving the hash route", () => {
    expect(
      getUrlWithoutTrackingParameters(
        "https://example.com/app/?fbclid=facebook&gclid=google&utm_source=messenger#/chapters",
      ),
    ).toBe("/app/#/chapters");
  });

  it("preserves application query parameters", () => {
    expect(
      getUrlWithoutTrackingParameters(
        "https://example.com/app/?language=el&utm_campaign=summer&chapter=4#/quiz",
      ),
    ).toBe("/app/?language=el&chapter=4#/quiz");
  });

  it("matches tracking parameter names without case sensitivity", () => {
    expect(
      getUrlWithoutTrackingParameters(
        "https://example.com/app/?FbClId=value&UTM_Medium=social#/",
      ),
    ).toBe("/app/#/");
  });

  it("returns null when no tracking parameter exists", () => {
    expect(getUrlWithoutTrackingParameters("https://example.com/app/?chapter=3#/review")).toBeNull();
  });
});
