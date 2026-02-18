import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";

export function registerStashCommands(program: Command): void {
  program
    .command("st")
    .description("Stash all changes (git stash)")
    .option("-m, --message <message>", "Stash with a descriptive message")
    .action(
      withErrorHandling(async (opts: { message?: string }) => {
        await requireGitRepo();

        if (opts.message) {
          console.log(`→ Stashing changes: ${opts.message}...`);
        } else {
          console.log("→ Stashing changes...");
        }
        await gitOps.stash(opts.message);
        console.log("✔ Stashed.");
      })
    );

  program
    .command("stp")
    .description("Pop the latest stash (git stash pop)")
    .action(
      withErrorHandling(async () => {
        await requireGitRepo();

        console.log("→ Restoring stashed changes...");
        await gitOps.stashPop();
        console.log("✔ Restored.");
      })
    );

  program
    .command("stl")
    .description("List all stashes (git stash list)")
    .action(
      withErrorHandling(async () => {
        await requireGitRepo();

        const output = await gitOps.stashList();
        if (output) {
          console.log(output.trimEnd());
        } else {
          console.log("✨ No stashes found.");
        }
      })
    );
}
