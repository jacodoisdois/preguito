import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { PrequitoConfig, PrequitoFeatures, ShortcodeEntry } from "./types.js";
import {
  CONFIG_PATHS,
  DEFAULT_CONFIG,
  PREDEFINED_TYPES,
  PREDEFINED_ENVIRONMENTS,
} from "./types.js";
import { parseTemplate } from "../template/engine.js";

export async function findConfigPath(): Promise<string | null> {
  const cwd = process.cwd();
  const home = homedir();

  // Project-local first
  for (const relPath of [".preguitorc", ".preguitorc.json"]) {
    const fullPath = join(cwd, relPath);
    if (existsSync(fullPath)) return fullPath;
  }

  // Then home directory
  for (const relPath of CONFIG_PATHS) {
    const fullPath = join(home, relPath);
    if (existsSync(fullPath)) return fullPath;
  }

  return null;
}

export async function loadConfig(): Promise<PrequitoConfig | null> {
  const configPath = await findConfigPath();
  if (!configPath) return null;

  const raw = await readFile(configPath, "utf-8");
  const parsed = JSON.parse(raw);

  return validateConfig(parsed);
}

export async function loadConfigOrDefault(): Promise<PrequitoConfig> {
  return (await loadConfig()) ?? DEFAULT_CONFIG;
}

function validateConfig(obj: unknown): PrequitoConfig {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Config must be a JSON object");
  }

  const config = obj as Record<string, unknown>;

  if (typeof config.template !== "string" || config.template.trim() === "") {
    throw new Error('Config must have a non-empty "template" string field');
  }

  // Parse defaults
  const defaults: Record<string, string> = {};
  if (config.defaults !== undefined) {
    if (typeof config.defaults !== "object" || config.defaults === null) {
      throw new Error('"defaults" must be an object');
    }
    for (const [key, value] of Object.entries(
      config.defaults as Record<string, unknown>
    )) {
      if (typeof value !== "string") {
        throw new Error(`Default value for "${key}" must be a string`);
      }
      defaults[key] = value;
    }
  }

  // Features: explicit or inferred from template
  let features: PrequitoFeatures;
  if (config.features && typeof config.features === "object") {
    const f = config.features as Record<string, unknown>;
    features = {
      cardId: Boolean(f.cardId),
      type: Boolean(f.type),
      environment: Boolean(f.environment),
    };
  } else {
    features = inferFeaturesFromTemplate(config.template as string);
  }

  // Types array
  let types: ShortcodeEntry[] = [];
  if (Array.isArray(config.types)) {
    types = validateShortcodeArray(config.types, "types");
  } else if (features.type) {
    types = [...PREDEFINED_TYPES];
  }

  // Environments array
  let environments: ShortcodeEntry[] = [];
  if (Array.isArray(config.environments)) {
    environments = validateShortcodeArray(config.environments, "environments");
  } else if (features.environment) {
    environments = [...PREDEFINED_ENVIRONMENTS];
  }

  return { template: config.template as string, features, types, environments, defaults };
}

function inferFeaturesFromTemplate(template: string): PrequitoFeatures {
  const parsed = parseTemplate(template);
  return {
    cardId: parsed.variables.includes("card_id"),
    type: parsed.variables.includes("type"),
    environment: parsed.variables.includes("environment"),
  };
}

function validateShortcodeArray(
  arr: unknown[],
  fieldName: string
): ShortcodeEntry[] {
  const result: ShortcodeEntry[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as Record<string, unknown>).key !== "string" ||
      typeof (item as Record<string, unknown>).label !== "string"
    ) {
      throw new Error(
        `${fieldName}[${i}] must be an object with "key" and "label" string fields`
      );
    }
    const entry = item as ShortcodeEntry;
    if (entry.key.length !== 1) {
      throw new Error(
        `${fieldName}[${i}].key must be a single character, got "${entry.key}"`
      );
    }
    result.push({ key: entry.key, label: entry.label });
  }
  return result;
}

export async function writeConfig(config: PrequitoConfig): Promise<string> {
  const home = homedir();
  const configDir = join(home, ".config", "preguito");
  const configPath = join(configDir, "config.json");

  if (!existsSync(configDir)) {
    await mkdir(configDir, { recursive: true });
  }

  await writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  return configPath;
}
