import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerUndoCommand(program: Command): void {
  program
    .command("u [count]")
    .alias("undo")
    .description("Undo last N commits, keep changes staged (e.g. guito u 3)")
    .action(async (count?: string) => {
      try {
        await executeUndo(count);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeUndo(count?: string): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const num = count ? parseInt(count, 10) : 1;
  if (isNaN(num) || num <= 0) {
    console.error("✖ Count must be a positive integer.");
    process.exit(1);
  }

  console.log(`→ Undoing last ${num} commit(s)...`);
  await gitOps.resetSoft(num);
  console.log(`✔ Undid last ${num} commit(s). Changes are staged.`);

  const st = await gitOps.status();
  if (st) console.log(st);
}
