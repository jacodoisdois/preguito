import { describe, it, expect } from "vitest";
import {
  parseTemplate,
  renderTemplate,
  mergeContext,
} from "../../src/template/engine.js";

describe("parseTemplate", () => {
  it("extracts variable names from {{var}} syntax", () => {
    const result = parseTemplate(
      "[{{squad}}-{{card_id}}] {{type}}: <message>"
    );
    expect(result.variables).toEqual(["squad", "card_id", "type"]);
  });

  it("extracts the message placeholder from <name> syntax", () => {
    const result = parseTemplate("{{type}}: <message>");
    expect(result.messagePlaceholder).toBe("message");
  });

  it("deduplicates repeated variables", () => {
    const result = parseTemplate("{{a}} {{a}} {{b}}");
    expect(result.variables).toEqual(["a", "b"]);
  });

  it("handles template with no variables", () => {
    const result = parseTemplate("<message>");
    expect(result.variables).toEqual([]);
    expect(result.messagePlaceholder).toBe("message");
  });

  it("handles template with no message placeholder", () => {
    const result = parseTemplate("{{type}}: {{description}}");
    expect(result.messagePlaceholder).toBeNull();
  });
});

describe("renderTemplate", () => {
  it("replaces all variables and message", () => {
    const result = renderTemplate(
      "[{{squad}}-{{card_id}}] {{type}}: <message>",
      { squad: "TEAM", card_id: "123", type: "feat" },
      "add login"
    );
    expect(result).toBe("[TEAM-123] feat: add login");
  });

  it("renders complex template with scope", () => {
    const result = renderTemplate(
      "[{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>",
      { squad: "PAYMENTS", card_id: "42", type: "fix", scope: "api" },
      "fix timeout"
    );
    expect(result).toBe("[PAYMENTS-42] fix(api): fix timeout");
  });

  it("throws on missing variable", () => {
    expect(() =>
      renderTemplate("{{squad}}: <message>", {}, "msg")
    ).toThrow("Missing template variable(s): squad");
  });

  it("throws listing all missing variables", () => {
    expect(() =>
      renderTemplate("{{a}} {{b}} {{c}}: <message>", { a: "x" }, "msg")
    ).toThrow("Missing template variable(s): b, c");
  });

  it("throws on missing message when placeholder exists", () => {
    expect(() =>
      renderTemplate("{{type}}: <message>", { type: "fix" })
    ).toThrow("Template requires a message");
  });

  it("works with template that has no message placeholder", () => {
    const result = renderTemplate("{{type}}: {{desc}}", {
      type: "fix",
      desc: "broken login",
    });
    expect(result).toBe("fix: broken login");
  });
});

describe("mergeContext", () => {
  it("CLI overrides take precedence over defaults", () => {
    const result = mergeContext(
      { squad: "DEFAULT", type: "feat" },
      { type: "fix" }
    );
    expect(result).toEqual({ squad: "DEFAULT", type: "fix" });
  });

  it("adds new keys from overrides", () => {
    const result = mergeContext({ type: "feat" }, { card_id: "123" });
    expect(result).toEqual({ type: "feat", card_id: "123" });
  });

  it("returns defaults when no overrides", () => {
    const result = mergeContext({ type: "feat" }, {});
    expect(result).toEqual({ type: "feat" });
  });
});
