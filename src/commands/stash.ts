import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerStashCommands(program: Command): void {
  program
    .command("st")
    .description("Stash all changes (git stash)")
    .action(async () => {
      try {
        await executeStash();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("stp")
    .description("Pop the latest stash (git stash pop)")
    .action(async () => {
      try {
        await executeStashPop();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeStash(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  console.log("→ Stashing changes...");
  await gitOps.stash();
  console.log("✔ Stashed.");
}

async function executeStashPop(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  console.log("→ Restoring stashed changes...");
  await gitOps.stashPop();
  console.log("✔ Restored.");
}
