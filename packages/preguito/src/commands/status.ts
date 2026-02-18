import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";

export function registerStatusCommand(program: Command): void {
  program
    .command("s")
    .alias("status")
    .description("Short status (git status --short)")
    .action(
      withErrorHandling(async () => {
        await requireGitRepo();

        const output = await gitOps.status();
        if (output) {
          console.log(output.trimEnd());
        } else {
          console.log("✨ Nothing to commit, working tree clean.");
        }
      })
    );
}
