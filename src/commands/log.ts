import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerLogCommand(program: Command): void {
  program
    .command("l [count]")
    .alias("log")
    .description("Show compact git log (default: last 10 commits)")
    .action(async (count?: string) => {
      try {
        await executeLog(count);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeLog(count?: string): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("Error: Not inside a git repository.");
    process.exit(1);
  }

  const num = count ? parseInt(count, 10) : 10;
  if (isNaN(num) || num <= 0) {
    console.error("Error: Count must be a positive integer.");
    process.exit(1);
  }

  const output = await gitOps.logOneline(num);
  if (output) {
    console.log(output.trimEnd());
  } else {
    console.log("No commits found.");
  }
}
