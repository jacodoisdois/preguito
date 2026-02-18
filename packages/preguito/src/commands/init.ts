import { Command } from "commander";
import { createInterface, type Interface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { writeConfig } from "../config/loader.js";
import { generateTemplate } from "../config/types.js";
import { printUsageExamples } from "./usage-examples.js";
import type {
  PrequitoConfig,
  PrequitoFeatures,
  ShortcodeEntry,
} from "../config/types.js";
import {
  DEFAULT_CONFIG,
  PREDEFINED_TYPES,
  PREDEFINED_ENVIRONMENTS,
} from "../config/types.js";

const SLOTH_BANNER = [
  "",
  "          ⢿⣿⣿⠿⠿⠿⠻⠿⢿⡿⣿",
  "     ⣿⡿⠟⠉⠈⠉⠉⠄⢠⠄⠄⢀⠄⠄⡬⠛⢿⢿⣿⣿",
  "  ⣿⡿⡿⠉⠄⠄⠄⠄⠄⠄⠅⠄⠅⠄⠐⠄⠄⠄⠁⠤⠄⠛⢿⢿⣿",
  " ⣿⣿⠍⠄⠄⠄⠄⠄⠄⠄⠄⣀⣀⠄⣀⣠⣀⠄⢈⣑⣢⣤⡄⠔⠫⢻⣿⣿",
  "⣿⡏⠂⠄⠄⢀⣠⣤⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⣔⠂⡙⣿⣿",
  "⡿⠄⠄⣠⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣈⣿",
  "⠇⠄⢠⣿⣿⣿⣿⣿⡿⠿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠿⠿⢿⡿⣿⣿⣿⣿⣿⡧⣼",
  "⠄⠄⠽⠿⠟⠋⠁⠙⠄⢠⣿⡿⢿⣿⣿⣿⣿⣿⣷⡠⢌⣧⠄⠈⠛⠉⠛⠐⡋⢹",
  "⠄⠄⠄⠄⠄⠄⠄⢀⣠⣾⡿⠑⠚⠋⠛⠛⠻⢿⣿⣿⣶⣤⡄⢀⣀⣀⡀⠈⠄⢸",
  "⣄⠄⠄⠄⢰⣾⠟⠋⠛⠛⠂⠄⠄⠄⠄⠒⠂⠛⡿⢟⠻⠃⠄⢼⣿⣿⣷⠤⠁⢸",
  "⣿⡄⠄⢀⢝⢓⠄⠄⠄⠄⠄⠄⠄⠄⠠⠠⠶⢺⣿⣯⣵⣦⣴⣿⣿⣿⣿⡏⠄⢸",
  " ⣿⡀⠄⠈⠄⠄⠄⠠⢾⣷⣄⢄⣀⡈⡀⠠⣾⣿⣿⣿⣿⣿⣿⣿⡿⠿⢏⣀⣾",
  "  ⣷⣄⠄⠄⠄⢀⠈⠈⠙⠑⠗⠙⠙⠛⠄⠈⠹⠻⢿⡻⣿⠿⢿⣝⡑⢫⣾",
  "    ⣿⣆⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠑⠐⠚⣨⣤⣾",
  "",
  "        🦥  p r e g u i t o",
  "         lazy git, happy dev",
  "",
  "     ✨ Welcome to the setup wizard!",
  "",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printFeedback(enabled: boolean, featureName: string): void {
  const symbol = enabled ? "✓" : "○";
  const status = enabled ? "will be included" : "will be skipped";
  console.log(`     ${symbol} ${featureName} ${status}\n`);
}

async function printBanner(): Promise<void> {
  for (const line of SLOTH_BANNER) {
    console.log(line);
    await sleep(60);
  }
}

export function registerInitCommand(program: Command): void {
  program
    .command("i")
    .alias("init")
    .description("Setup wizard to create your preguito config")
    .option("--default", "Use default config without prompts")
    .action(async (opts) => {
      if (opts.default) {
        const path = await writeConfig(DEFAULT_CONFIG);
        console.log(`✅ Config written to ${path}`);
        return;
      }
      await interactiveInit();
    });
}

async function interactiveInit(): Promise<void> {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    await printBanner();

    // Step 1: Feature selection
    console.log("📋 Choose which features to enable:\n");

    const cardId = await askYesNo(rl, "  🎫 Include card/ticket ID in commits?");
    printFeedback(cardId, "Card ID");

    const type = await askYesNo(rl, "  🏷️  Include commit type (feat, fix, chore...)?");
    printFeedback(type, "Commit type");

    const environment = await askYesNo(rl, "  🌍 Include environment (prd, uat, dev...)?");
    printFeedback(environment, "Environment");

    const features: PrequitoFeatures = { cardId, type, environment };

    // Step 2: Prefix (if cardId enabled)
    const defaults: Record<string, string> = {};
    if (features.cardId) {
      const prefix = await rl.question(
        "\n🔤 Project prefix/acronym (e.g. PROJ, leave empty to skip): "
      );
      const trimmedPrefix = prefix.trim();
      if (trimmedPrefix) {
        defaults.prefix = trimmedPrefix.toUpperCase();
        console.log(`     ✓ Prefix set to "${defaults.prefix}"\n`);
      } else {
        console.log(`     ○ No prefix configured\n`);
      }
    }

    const hasPrefix = "prefix" in defaults;

    // Step 3: Types
    let types: ShortcodeEntry[] = [];
    if (features.type) {
      console.log("\n🏷️  Available commit types:\n");
      for (const t of PREDEFINED_TYPES) {
        console.log(`   ${t.key} → ${t.label}`);
      }

      const typeInput = await rl.question(
        "\n  Which types? (comma-separated labels, or 'all'): "
      );
      types = selectEntries(PREDEFINED_TYPES, typeInput);

      if (types.length === 0) {
        console.log("  ℹ️  No valid types selected, using all.");
        types = [...PREDEFINED_TYPES];
      }

      console.log(`     ✓ ${types.length} type(s) selected: ${types.map((t) => t.label).join(", ")}\n`);

      console.log("✏️  Customize shortcode letters (Enter to keep default):\n");
      types = await customizeKeys(rl, types);
      console.log(`     ✓ Shortcodes configured\n`);
    }

    // Step 4: Environments
    let environments: ShortcodeEntry[] = [];
    if (features.environment) {
      console.log("\n🌍 Available environments:\n");
      for (const e of PREDEFINED_ENVIRONMENTS) {
        console.log(`   ${e.key} → ${e.label}`);
      }

      const envInput = await rl.question(
        "\n  Which environments? (comma-separated labels, or 'all'): "
      );
      environments = selectEntries(PREDEFINED_ENVIRONMENTS, envInput);

      if (environments.length === 0) {
        console.log("  ℹ️  No valid environments selected, using all.");
        environments = [...PREDEFINED_ENVIRONMENTS];
      }

      console.log(`     ✓ ${environments.length} environment(s) selected: ${environments.map((e) => e.label).join(", ")}\n`);

      console.log("✏️  Customize shortcode letters (Enter to keep default):\n");
      environments = await customizeKeys(rl, environments);
      console.log(`     ✓ Shortcodes configured\n`);
    }

    // Step 5: Validate and resolve letter conflicts
    if (features.type && features.environment) {
      let conflicts = findKeyConflicts(types, environments);
      while (conflicts.length > 0) {
        console.log("\n⚠️  Letter conflicts detected:\n");
        for (const c of conflicts) {
          console.log(
            `   "${c.key}" is used for both type "${c.typeLabel}" and environment "${c.envLabel}"`
          );
        }
        console.log("\n  Reassign letters for the conflicting types:\n");
        for (const c of conflicts) {
          const answer = await rl.question(`   ${c.typeLabel} [${c.key}]: `);
          const newKey = answer.trim().toLowerCase();
          if (newKey && newKey.length === 1 && /^[a-z]$/.test(newKey)) {
            const entry = types.find((t) => t.key === c.key && t.label === c.typeLabel);
            if (entry) entry.key = newKey;
          }
        }
        conflicts = findKeyConflicts(types, environments);
      }
    }

    // Step 6: Generate template and save
    const template = generateTemplate(features, hasPrefix);

    const config: PrequitoConfig = {
      template,
      features,
      types,
      environments,
      defaults,
    };

    const path = await writeConfig(config);

    // Summary
    console.log("\n─────────────────────────────────────");
    console.log("✅ Setup complete!\n");

    const SLOTH_DONE = [
      "              ╭────────────────╮",
      "              │ ╭──╮      ╭──╮ │",
      "              │ │⌐■│      │■ │ │",
      "              │ ╰──╯  ᴥ   ╰──╯ │",
      "              │     .────.     │",
      "              ╰────────────────╯",
      "       all set, now go be lazy 🦥",
    ];
    for (const line of SLOTH_DONE) {
      console.log(line);
      await sleep(40);
    }

    console.log("");
    console.log(`  📄 Config saved to ${path}`);
    console.log(`  📝 Template: ${template}`);

    if (types.length > 0 || environments.length > 0) {
      console.log("\n  🔑 Your shortcodes:");
      if (types.length > 0) {
        console.log(`     Types: ${types.map((t) => `${t.key}=${t.label}`).join(", ")}`);
      }
      if (environments.length > 0) {
        console.log(`     Envs:  ${environments.map((e) => `${e.key}=${e.label}`).join(", ")}`);
      }
    }

    printUsageExamples(config);

    console.log("\n  💡 Run 'guito cfg' to view your config anytime.");
    console.log("─────────────────────────────────────\n");
  } finally {
    rl.close();
  }
}

async function askYesNo(rl: Interface, question: string): Promise<boolean> {
  const answer = await rl.question(`${question} (y/n): `);
  return answer.trim().toLowerCase().startsWith("y");
}

function selectEntries(
  predefined: ShortcodeEntry[],
  input: string
): ShortcodeEntry[] {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === "all" || trimmed === "") {
    return [...predefined];
  }

  const requested = trimmed.split(",").map((s) => s.trim());
  return predefined.filter(
    (entry) => requested.includes(entry.label) || requested.includes(entry.key)
  );
}

async function customizeKeys(
  rl: Interface,
  entries: ShortcodeEntry[]
): Promise<ShortcodeEntry[]> {
  const result: ShortcodeEntry[] = [];
  const usedKeys = new Set<string>();

  for (const entry of entries) {
    const answer = await rl.question(`   ${entry.label} [${entry.key}]: `);
    let key = answer.trim().toLowerCase();

    if (!key) {
      key = entry.key;
    }

    if (key.length !== 1 || !/^[a-z]$/.test(key)) {
      console.log(`   ⚠️  Invalid key "${key}", keeping "${entry.key}".`);
      key = entry.key;
    }

    if (usedKeys.has(key)) {
      console.log(`   ⚠️  Key "${key}" already used, keeping "${entry.key}".`);
      key = entry.key;
    }

    usedKeys.add(key);
    result.push({ key, label: entry.label });
  }

  return result;
}

interface KeyConflict {
  key: string;
  typeLabel: string;
  envLabel: string;
}

function findKeyConflicts(
  types: ShortcodeEntry[],
  environments: ShortcodeEntry[]
): KeyConflict[] {
  const typeMap = new Map(types.map((t) => [t.key, t.label]));
  const conflicts: KeyConflict[] = [];
  for (const env of environments) {
    if (typeMap.has(env.key)) {
      conflicts.push({
        key: env.key,
        typeLabel: typeMap.get(env.key)!,
        envLabel: env.label,
      });
    }
  }
  return conflicts;
}
