import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerStashCommands(program: Command): void {
  program
    .command("st")
    .description("Stash all changes")
    .action(async () => {
      try {
        await executeStash();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("stp")
    .description("Pop the latest stash")
    .action(async () => {
      try {
        await executeStashPop();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeStash(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("Error: Not inside a git repository.");
    process.exit(1);
  }

  const output = await gitOps.stash();
  console.log(output.trimEnd());
}

async function executeStashPop(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("Error: Not inside a git repository.");
    process.exit(1);
  }

  const output = await gitOps.stashPop();
  console.log(output.trimEnd());
}
