import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling, parseCount } from "../utils/command.js";

export function registerLogCommand(program: Command): void {
  program
    .command("l [count]")
    .alias("log")
    .description("Compact log, default last 10 (e.g. guito l 20)")
    .action(
      withErrorHandling(async (count?: string) => {
        await requireGitRepo();

        const num = parseCount(count, 10);
        const output = await gitOps.logOneline(num);
        if (output) {
          console.log(output.trimEnd());
        } else {
          console.log("✨ No commits found.");
        }
      })
    );
}
