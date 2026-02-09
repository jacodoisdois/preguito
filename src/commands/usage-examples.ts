import type { PrequitoConfig } from "../config/types.js";
import { renderTemplate, mergeContext } from "../template/engine.js";

export function printUsageExamples(config: PrequitoConfig): void {
  console.log("\n  📖 Examples:\n");

  const { features, types, environments, defaults } = config;
  const exType = types[0];
  const exEnv = environments[0];
  const exCardId = "1234";
  const exMessage = "add login endpoint";

  if (features.cardId && features.type && features.environment && exType && exEnv) {
    const shortcodes = `${exType.key}${exEnv.key}`;
    const context = mergeContext(defaults, {
      card_id: exCardId,
      type: exType.label,
      environment: exEnv.label,
    });
    const rendered = renderTemplate(config.template, context, exMessage);
    console.log(`     $ guito c ${exCardId} ${shortcodes} "${exMessage}"`);
    console.log(`     → ${rendered}`);

    if (types.length > 1 && environments.length > 1) {
      const t2 = types[1];
      const e2 = environments[1];
      const ctx2 = mergeContext(defaults, {
        card_id: "5678",
        type: t2.label,
        environment: e2.label,
      });
      const r2 = renderTemplate(config.template, ctx2, "fix timeout bug");
      console.log(`\n     $ guito c 5678 ${t2.key}${e2.key} "fix timeout bug"`);
      console.log(`     → ${r2}`);
    }
  } else if (features.cardId && features.type && exType) {
    const context = mergeContext(defaults, {
      card_id: exCardId,
      type: exType.label,
    });
    const rendered = renderTemplate(config.template, context, exMessage);
    console.log(`     $ guito c ${exCardId} ${exType.key} "${exMessage}"`);
    console.log(`     → ${rendered}`);
  } else if (features.cardId && features.environment && exEnv) {
    const context = mergeContext(defaults, {
      card_id: exCardId,
      environment: exEnv.label,
    });
    const rendered = renderTemplate(config.template, context, exMessage);
    console.log(`     $ guito c ${exCardId} ${exEnv.key} "${exMessage}"`);
    console.log(`     → ${rendered}`);
  } else if (features.type && features.environment && exType && exEnv) {
    const context: Record<string, string> = {
      type: exType.label,
      environment: exEnv.label,
    };
    const rendered = renderTemplate(config.template, context, exMessage);
    console.log(`     $ guito c ${exType.key}${exEnv.key} "${exMessage}"`);
    console.log(`     → ${rendered}`);
  } else if (features.type && exType) {
    const context: Record<string, string> = { type: exType.label };
    const rendered = renderTemplate(config.template, context, exMessage);
    console.log(`     $ guito c ${exType.key} "${exMessage}"`);
    console.log(`     → ${rendered}`);
  } else if (features.cardId) {
    const context = mergeContext(defaults, { card_id: exCardId });
    const rendered = renderTemplate(config.template, context, exMessage);
    console.log(`     $ guito c ${exCardId} "${exMessage}"`);
    console.log(`     → ${rendered}`);
  } else {
    console.log(`     $ guito c "${exMessage}"`);
    console.log(`     → ${exMessage}`);
  }

  console.log("\n     Flags: -p (push)  -f (force push)  -d (dry-run)  -S (skip staging)");
}
