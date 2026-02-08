import { Command } from "commander";
import { loadConfig, findConfigPath } from "../config/loader.js";
import { parseTemplate } from "../template/engine.js";

export function registerConfigCommand(program: Command): void {
  program
    .command("cfg")
    .alias("config")
    .description("Show current preguito configuration")
    .option("--path", "Show only the config file path")
    .option("--template", "Show only the template")
    .option("--variables", "Show template variables and their defaults")
    .action(async (opts) => {
      const config = await loadConfig();

      if (!config) {
        console.log('✖ No config found. Run "guito i" to create one.');
        return;
      }

      if (opts.path) {
        const path = await findConfigPath();
        console.log(path);
        return;
      }

      if (opts.template) {
        console.log(config.template);
        return;
      }

      const parsed = parseTemplate(config.template);

      if (opts.variables) {
        for (const v of parsed.variables) {
          const def = config.defaults[v] ?? "(no default)";
          console.log(`  ${v}: ${def}`);
        }
        return;
      }

      // Default: show everything
      const configPath = await findConfigPath();
      console.log(`Config file: ${configPath}`);
      console.log(`Template: ${config.template}`);
      if (parsed.variables.length > 0) {
        console.log("Variables:");
        for (const v of parsed.variables) {
          const def = config.defaults[v] ?? "(no default)";
          console.log(`  ${v}: ${def}`);
        }
      }
      if (parsed.messagePlaceholder) {
        console.log(
          `Message placeholder: <${parsed.messagePlaceholder}> (passed via -m)`
        );
      }
    });
}
