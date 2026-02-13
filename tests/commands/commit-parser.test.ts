import { describe, it, expect } from "vitest";
import {
  parsePositionalArgs,
  resolveShortcodes,
} from "../../src/commands/commit-parser.js";
import type { PrequitoConfig } from "../../src/config/types.js";

const fullConfig: PrequitoConfig = {
  template: "[{{prefix}}-{{card_id}}] {{type}}({{environment}}): <message>",
  features: { cardId: true, type: true, environment: true },
  types: [
    { key: "f", label: "feat" },
    { key: "x", label: "fix" },
    { key: "c", label: "chore" },
    { key: "t", label: "test" },
  ],
  environments: [
    { key: "p", label: "prd" },
    { key: "u", label: "uat" },
    { key: "d", label: "dev" },
  ],
  defaults: { prefix: "PROJ" },
};

const typeOnlyConfig: PrequitoConfig = {
  template: "{{type}}: <message>",
  features: { cardId: false, type: true, environment: false },
  types: [
    { key: "f", label: "feat" },
    { key: "x", label: "fix" },
  ],
  environments: [],
  defaults: {},
};

const noFeaturesConfig: PrequitoConfig = {
  template: "<message>",
  features: { cardId: false, type: false, environment: false },
  types: [],
  environments: [],
  defaults: {},
};

const cardOnlyConfig: PrequitoConfig = {
  template: "[{{card_id}}] <message>",
  features: { cardId: true, type: false, environment: false },
  types: [],
  environments: [],
  defaults: {},
};

describe("parsePositionalArgs", () => {
  describe("all features enabled", () => {
    it("parses card_id, shortcodes, and message", () => {
      const result = parsePositionalArgs(["1234", "fp", "my", "commit"], fullConfig);
      expect(result.context.card_id).toBe("1234");
      expect(result.context.type).toBe("feat");
      expect(result.context.environment).toBe("prd");
      expect(result.context.prefix).toBe("PROJ");
      expect(result.message).toBe("my commit");
    });

    it("shortcode order does not matter", () => {
      const r1 = parsePositionalArgs(["1234", "fp", "msg"], fullConfig);
      const r2 = parsePositionalArgs(["1234", "pf", "msg"], fullConfig);
      expect(r1.context.type).toBe(r2.context.type);
      expect(r1.context.environment).toBe(r2.context.environment);
    });

    it("works with different shortcodes", () => {
      const result = parsePositionalArgs(["99", "xu", "fix", "bug"], fullConfig);
      expect(result.context.card_id).toBe("99");
      expect(result.context.type).toBe("fix");
      expect(result.context.environment).toBe("uat");
      expect(result.message).toBe("fix bug");
    });
  });

  describe("type only", () => {
    it("parses shortcode and message", () => {
      const result = parsePositionalArgs(["f", "my", "message"], typeOnlyConfig);
      expect(result.context.type).toBe("feat");
      expect(result.message).toBe("my message");
    });

    it("no card_id in context", () => {
      const result = parsePositionalArgs(["x", "fix", "it"], typeOnlyConfig);
      expect(result.context.card_id).toBeUndefined();
      expect(result.context.type).toBe("fix");
    });
  });

  describe("card only", () => {
    it("parses card_id and message", () => {
      const result = parsePositionalArgs(["1234", "my", "message"], cardOnlyConfig);
      expect(result.context.card_id).toBe("1234");
      expect(result.message).toBe("my message");
    });
  });

  describe("no features", () => {
    it("entire input is the message", () => {
      const result = parsePositionalArgs(["my", "commit", "message"], noFeaturesConfig);
      expect(result.message).toBe("my commit message");
      expect(result.context.card_id).toBeUndefined();
      expect(result.context.type).toBeUndefined();
    });
  });

  describe("errors", () => {
    it("throws on empty args", () => {
      expect(() => parsePositionalArgs([], fullConfig)).toThrow(
        "No arguments provided"
      );
    });

    it("throws on missing shortcodes", () => {
      expect(() => parsePositionalArgs(["1234"], fullConfig)).toThrow(
        "Missing shortcodes"
      );
    });

    it("throws on missing message", () => {
      expect(() => parsePositionalArgs(["1234", "fp"], fullConfig)).toThrow(
        "Missing commit message"
      );
    });

    it("throws on missing message (type only)", () => {
      expect(() => parsePositionalArgs(["f"], typeOnlyConfig)).toThrow(
        "Missing commit message"
      );
    });
  });
});

describe("resolveShortcodes", () => {
  it("resolves type and environment", () => {
    const result = resolveShortcodes("fp", fullConfig);
    expect(result.type).toBe("feat");
    expect(result.environment).toBe("prd");
  });

  it("resolves reversed order", () => {
    const result = resolveShortcodes("uf", fullConfig);
    expect(result.type).toBe("feat");
    expect(result.environment).toBe("uat");
  });

  it("resolves type only when env disabled", () => {
    const result = resolveShortcodes("f", typeOnlyConfig);
    expect(result.type).toBe("feat");
    expect(result.environment).toBeUndefined();
  });

  it("throws on unknown shortcode", () => {
    expect(() => resolveShortcodes("fz", fullConfig)).toThrow(
      'Unknown shortcode "z"'
    );
  });

  it("throws on multiple type shortcodes", () => {
    expect(() => resolveShortcodes("fxp", fullConfig)).toThrow(
      "Multiple type shortcodes"
    );
  });

  it("throws on multiple environment shortcodes", () => {
    expect(() => resolveShortcodes("fpu", fullConfig)).toThrow(
      "Multiple environment shortcodes"
    );
  });

  it("throws when type required but not provided", () => {
    const envOnlyShortcode = "p";
    // Config expects both type and env, but only env provided
    expect(() => resolveShortcodes(envOnlyShortcode, fullConfig)).toThrow(
      "No type shortcode found"
    );
  });

  it("allows omitting environment when enabled (environment is optional)", () => {
    const typeOnlyShortcode = "f";
    // Config has environment enabled, but only type provided - should work
    const result = resolveShortcodes(typeOnlyShortcode, fullConfig);
    expect(result).toEqual({ type: "feat" }); // no environment in result
  });

  it("detects ambiguous shortcode", () => {
    const ambiguousConfig: PrequitoConfig = {
      template: "{{type}}({{environment}}): <message>",
      features: { cardId: false, type: true, environment: true },
      types: [{ key: "p", label: "perf" }],
      environments: [{ key: "p", label: "prd" }],
      defaults: {},
    };
    expect(() => resolveShortcodes("p", ambiguousConfig)).toThrow(
      'Ambiguous shortcode "p"'
    );
  });
});
