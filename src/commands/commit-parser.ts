import type { PrequitoConfig } from "../config/types.js";
import { mergeContext } from "../template/engine.js";
import { PrequitoError } from "../utils/errors.js";

export interface ParsedCommitArgs {
  context: Record<string, string>;
  message: string;
  body?: string;
}

export function parsePositionalArgs(
  args: string[],
  config: PrequitoConfig,
  bodyFromFlag?: string
): ParsedCommitArgs {
  if (args.length === 0) {
    throw new PrequitoError(
      "No arguments provided. Usage: guito c [card_id] [shortcodes] <message...>"
    );
  }

  const context: Record<string, string> = {};
  let cursor = 0;

  if (config.features.cardId) {
    if (cursor >= args.length) {
      throw new PrequitoError("Missing card ID. It must be the first argument.");
    }
    context.card_id = args[cursor];
    cursor++;
  }

  if (config.features.type || config.features.environment) {
    if (cursor >= args.length) {
      throw new PrequitoError(
        "Missing shortcodes argument. Provide type/environment shortcodes."
      );
    }
    const resolved = resolveShortcodes(args[cursor], config);
    Object.assign(context, resolved);
    cursor++;
  }

  const messageParts = args.slice(cursor);
  if (messageParts.length === 0) {
    throw new PrequitoError("Missing commit message.");
  }
  const message = messageParts.join(" ");

  const finalContext = mergeContext(config.defaults, context);

  return { context: finalContext, message, body: bodyFromFlag };
}

export function resolveShortcodes(
  shortcodesStr: string,
  config: PrequitoConfig
): Record<string, string> {
  const result: Record<string, string> = {};

  const typeMap = new Map<string, string>();
  for (const t of config.types) {
    typeMap.set(t.key, t.label);
  }

  const envMap = new Map<string, string>();
  for (const e of config.environments) {
    envMap.set(e.key, e.label);
  }

  let foundType = false;
  let foundEnv = false;

  for (const char of shortcodesStr) {
    const isType = config.features.type && typeMap.has(char);
    const isEnv = config.features.environment && envMap.has(char);

    if (isType && isEnv) {
      throw new PrequitoError(
        `Ambiguous shortcode "${char}" matches both type "${typeMap.get(char)}" ` +
          `and environment "${envMap.get(char)}". Fix your config to avoid conflicts.`
      );
    }

    if (isType) {
      if (foundType) {
        throw new PrequitoError(
          `Multiple type shortcodes found in "${shortcodesStr}". Only one type allowed.`
        );
      }
      result.type = typeMap.get(char)!;
      foundType = true;
    } else if (isEnv) {
      if (foundEnv) {
        throw new PrequitoError(
          `Multiple environment shortcodes found in "${shortcodesStr}". Only one environment allowed.`
        );
      }
      result.environment = envMap.get(char)!;
      foundEnv = true;
    } else {
      const valid = [
        ...config.types.map((t) => `${t.key}=${t.label}`),
        ...config.environments.map((e) => `${e.key}=${e.label}`),
      ];
      throw new PrequitoError(
        `Unknown shortcode "${char}" in "${shortcodesStr}". Valid: ${valid.join(", ")}`
      );
    }
  }

  if (config.features.type && !foundType) {
    throw new PrequitoError(
      `No type shortcode found in "${shortcodesStr}". ` +
        `Valid types: ${config.types.map((t) => `${t.key}=${t.label}`).join(", ")}`
    );
  }

  // Environment is optional - if not provided, it won't be in the context
  // and will be cleaned up from the template automatically

  return result;
}
