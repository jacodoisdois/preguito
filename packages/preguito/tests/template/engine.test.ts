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

  it("replaces missing variables with empty string", () => {
    const result = renderTemplate("{{squad}}: <message>", {}, "msg");
    expect(result).toBe(": msg");
  });

  it("replaces multiple missing variables with empty strings and normalizes spaces", () => {
    const result = renderTemplate("{{a}} {{b}} {{c}}: <message>", { a: "x" }, "msg");
    expect(result).toBe("x: msg"); // cleanup normalizes multiple spaces
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

  it("renders with all variables present including optional environment", () => {
    const result = renderTemplate(
      "{{type}}({{environment}}): <message>",
      { type: "feat", environment: "prd" },
      "add feature"
    );
    expect(result).toBe("feat(prd): add feature");
  });

  it("renders without optional environment variable and cleans up empty parentheses", () => {
    const result = renderTemplate(
      "{{type}}({{environment}}): <message>",
      { type: "feat" },
      "add feature"
    );
    expect(result).toBe("feat: add feature");
  });

  it("cleans up empty brackets from optional variables", () => {
    const result = renderTemplate(
      "[{{card_id}}] {{type}}({{environment}}): <message>",
      { type: "feat" },
      "add feature"
    );
    expect(result).toBe("feat: add feature");
  });

  it("cleans up multiple empty patterns from missing optional variables", () => {
    const result = renderTemplate(
      "[{{card_id}}] {{type}}({{environment}}) [{{scope}}]: <message>",
      { card_id: "123", type: "feat" },
      "add feature"
    );
    expect(result).toBe("[123] feat: add feature");
  });

  it("normalizes multiple spaces after cleanup", () => {
    const result = renderTemplate(
      "{{type}}  ({{environment}})  : <message>",
      { type: "feat" },
      "add feature"
    );
    expect(result).toBe("feat: add feature");
  });

  it("removes space before colon after cleanup", () => {
    const result = renderTemplate(
      "{{type}} ({{environment}}) : <message>",
      { type: "fix" },
      "bug fix"
    );
    expect(result).toBe("fix: bug fix");
  });

  it("handles complex template with card_id prefix and optional environment", () => {
    const result = renderTemplate(
      "[{{prefix}}-{{card_id}}] {{type}}({{environment}}): <message>",
      { prefix: "TASK", card_id: "123", type: "feat" },
      "refactor code"
    );
    expect(result).toBe("[TASK-123] feat: refactor code");
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
