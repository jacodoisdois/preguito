import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerStatusCommand(program: Command): void {
  program
    .command("s")
    .alias("status")
    .description("Show short git status")
    .action(async () => {
      try {
        await executeStatus();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeStatus(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const output = await gitOps.status();
  if (output) {
    console.log(output.trimEnd());
  } else {
    console.log("✨ Nothing to commit, working tree clean.");
  }
}
