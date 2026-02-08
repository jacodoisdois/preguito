import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import type { PrequitoConfig } from "./types.js";
import { CONFIG_PATHS, DEFAULT_CONFIG } from "./types.js";

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

  return { template: config.template, defaults };
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
