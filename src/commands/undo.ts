import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling, parseCount } from "../utils/command.js";

export function registerUndoCommand(program: Command): void {
  program
    .command("u [count]")
    .alias("undo")
    .description("Undo last N commits, keep changes staged (e.g. guito u 3)")
    .action(
      withErrorHandling(async (count?: string) => {
        await requireGitRepo();

        const num = parseCount(count);
        console.log(`→ Undoing last ${num} commit(s)...`);
        await gitOps.resetSoft(num);
        console.log(`✔ Undid last ${num} commit(s). Changes are staged.`);

        const st = await gitOps.status();
        if (st) console.log(st);
      })
    );
}
