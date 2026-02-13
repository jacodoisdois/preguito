import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { spinner } from "../utils/spinner.js";

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

  const stop = spinner("Stashing changes...");
  await gitOps.stash();
  stop("✔ Stashed.");
}

async function executeStashPop(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const stop = spinner("Restoring stashed changes...");
  await gitOps.stashPop();
  stop("✔ Restored.");
}
