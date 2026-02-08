import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { writeConfig } from "../config/loader.js";
import { parseTemplate } from "../template/engine.js";
import type { PrequitoConfig } from "../config/types.js";
import { DEFAULT_CONFIG } from "../config/types.js";

export function registerInitCommand(program: Command): void {
  program
    .command("i")
    .alias("init")
    .description("Interactive setup to create your preguito config")
    .option("--default", "Use default config without prompts")
    .action(async (opts) => {
      if (opts.default) {
        const path = await writeConfig(DEFAULT_CONFIG);
        console.log(`Config written to ${path}`);
        return;
      }
      await interactiveInit();
    });
}

async function interactiveInit(): Promise<void> {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    console.log("Welcome to preguito setup!\n");
    console.log("Define your commit template.");
    console.log(
      "Use {{variable}} for named parameters and <message> for the commit message body."
    );
    console.log(
      'Example: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>\n'
    );

    const template =
      (await rl.question("Template: ")) || DEFAULT_CONFIG.template;

    const parsed = parseTemplate(template);
    console.log(
      `\nVariables found: ${parsed.variables.join(", ") || "(none)"}`
    );
    if (parsed.messagePlaceholder) {
      console.log(`Message placeholder: <${parsed.messagePlaceholder}>`);
    }

    const defaults: Record<string, string> = {};
    if (parsed.variables.length > 0) {
      console.log("\nSet default values (press Enter to skip):");
      for (const variable of parsed.variables) {
        const value = await rl.question(`  ${variable}: `);
        if (value.trim()) {
          defaults[variable] = value.trim();
        }
      }
    }

    const config: PrequitoConfig = { template, defaults };
    const path = await writeConfig(config);
    console.log(`\nConfig written to ${path}`);
    console.log("Edit it anytime or run 'guito cfg' to view it.");
  } finally {
    rl.close();
  }
}
