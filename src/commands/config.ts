import { Command } from "commander";
import { loadConfig, findConfigPath } from "../config/loader.js";
import { printUsageExamples } from "./usage-examples.js";

export function registerConfigCommand(program: Command): void {
  program
    .command("cfg")
    .alias("config")
    .description("Show current config (template, types, envs)")
    .option("--path", "Show only the config file path")
    .option("--template", "Show only the template")
    .action(async (opts) => {
      const config = await loadConfig();

      if (!config) {
        console.log('No config found. Run "guito i" to create one.');
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

      // Default: show everything
      const configPath = await findConfigPath();
      console.log(`📄 Config file: ${configPath}`);
      console.log(`📝 Template: ${config.template}`);

      console.log("Features:");
      console.log(`  🎫 Card ID: ${config.features.cardId ? "enabled" : "disabled"}`);
      console.log(`  🏷️  Commit type: ${config.features.type ? "enabled" : "disabled"}`);
      console.log(`  🌍 Environment: ${config.features.environment ? "enabled" : "disabled"}`);

      if (config.defaults.prefix) {
        console.log(`🔤 Prefix: ${config.defaults.prefix}`);
      }

      if (config.types.length > 0) {
        console.log("🏷️  Types:");
        for (const t of config.types) {
          console.log(`  ${t.key} = ${t.label}`);
        }
      }

      if (config.environments.length > 0) {
        console.log("🌍 Environments:");
        for (const e of config.environments) {
          console.log(`  ${e.key} = ${e.label}`);
        }
      }

      printUsageExamples(config);
    });
}
