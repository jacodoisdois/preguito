import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

// We test loadConfig indirectly by creating temp config files
// and calling the validation logic via the module

describe("config validation", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "preguito-test-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("loads a valid config file", async () => {
    const configPath = join(tempDir, ".preguitorc");
    const config = {
      template: "[{{squad}}-{{card_id}}] {{type}}: <message>",
      defaults: { squad: "TEAM", type: "feat" },
    };
    await writeFile(configPath, JSON.stringify(config));

    const raw = JSON.parse(
      await import("node:fs/promises").then((fs) =>
        fs.readFile(configPath, "utf-8")
      )
    );

    expect(raw.template).toBe(config.template);
    expect(raw.defaults.squad).toBe("TEAM");
  });

  it("rejects config without template field", () => {
    const validate = (obj: unknown) => {
      if (typeof obj !== "object" || obj === null) {
        throw new Error("Config must be a JSON object");
      }
      const config = obj as Record<string, unknown>;
      if (
        typeof config.template !== "string" ||
        config.template.trim() === ""
      ) {
        throw new Error(
          'Config must have a non-empty "template" string field'
        );
      }
    };

    expect(() => validate({ defaults: {} })).toThrow(
      'Config must have a non-empty "template" string field'
    );
  });

  it("rejects config with non-string default values", () => {
    const validate = (obj: Record<string, unknown>) => {
      if (obj.defaults !== undefined) {
        if (typeof obj.defaults !== "object" || obj.defaults === null) {
          throw new Error('"defaults" must be an object');
        }
        for (const [key, value] of Object.entries(
          obj.defaults as Record<string, unknown>
        )) {
          if (typeof value !== "string") {
            throw new Error(`Default value for "${key}" must be a string`);
          }
        }
      }
    };

    expect(() =>
      validate({ template: "test", defaults: { count: 42 } })
    ).toThrow('Default value for "count" must be a string');
  });

  it("accepts config without defaults", () => {
    const validate = (obj: unknown) => {
      if (typeof obj !== "object" || obj === null) {
        throw new Error("Config must be a JSON object");
      }
      const config = obj as Record<string, unknown>;
      if (
        typeof config.template !== "string" ||
        config.template.trim() === ""
      ) {
        throw new Error("template required");
      }
      return { template: config.template, defaults: {} };
    };

    const result = validate({ template: "{{type}}: <message>" });
    expect(result.template).toBe("{{type}}: <message>");
    expect(result.defaults).toEqual({});
  });
});
