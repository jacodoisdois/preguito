import { describe, it, expect } from "vitest";
import { generateTemplate } from "../../src/config/types.js";
import type { PrequitoFeatures } from "../../src/config/types.js";

describe("generateTemplate", () => {
  it("all features + prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: true, environment: true };
    expect(generateTemplate(features, true)).toBe(
      "[{{prefix}}-{{card_id}}] {{type}}({{environment}}): <message>"
    );
  });

  it("all features without prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: true, environment: true };
    expect(generateTemplate(features, false)).toBe(
      "[{{card_id}}] {{type}}({{environment}}): <message>"
    );
  });

  it("cardId + type + prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: true, environment: false };
    expect(generateTemplate(features, true)).toBe(
      "[{{prefix}}-{{card_id}}] {{type}}: <message>"
    );
  });

  it("cardId + type without prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: true, environment: false };
    expect(generateTemplate(features, false)).toBe(
      "[{{card_id}}] {{type}}: <message>"
    );
  });

  it("cardId + environment + prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: false, environment: true };
    expect(generateTemplate(features, true)).toBe(
      "[{{prefix}}-{{card_id}}] ({{environment}}): <message>"
    );
  });

  it("type + environment only", () => {
    const features: PrequitoFeatures = { cardId: false, type: true, environment: true };
    expect(generateTemplate(features, false)).toBe(
      "{{type}}({{environment}}): <message>"
    );
  });

  it("type only", () => {
    const features: PrequitoFeatures = { cardId: false, type: true, environment: false };
    expect(generateTemplate(features, false)).toBe("{{type}}: <message>");
  });

  it("environment only", () => {
    const features: PrequitoFeatures = { cardId: false, type: false, environment: true };
    expect(generateTemplate(features, false)).toBe("({{environment}}): <message>");
  });

  it("cardId only + prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: false, environment: false };
    expect(generateTemplate(features, true)).toBe("[{{prefix}}-{{card_id}}] <message>");
  });

  it("cardId only without prefix", () => {
    const features: PrequitoFeatures = { cardId: true, type: false, environment: false };
    expect(generateTemplate(features, false)).toBe("[{{card_id}}] <message>");
  });

  it("no features", () => {
    const features: PrequitoFeatures = { cardId: false, type: false, environment: false };
    expect(generateTemplate(features, false)).toBe("<message>");
  });
});
