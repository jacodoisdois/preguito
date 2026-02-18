import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";

export function registerSwitchCommand(program: Command): void {
  program
    .command("sw <branch>")
    .alias("switch")
    .description("Switch branch, -n to create (e.g. guito sw -n feature/x)")
    .option("-n, --new", "Create a new branch")
    .action(
      withErrorHandling(async (branch: string, opts: { new?: boolean }) => {
        await requireGitRepo();

        if (opts.new) {
          console.log(`→ Creating and switching to ${branch}...`);
          await gitOps.createBranch(branch);
        } else {
          console.log(`→ Switching to ${branch}...`);
          await gitOps.checkout(branch);
        }
        console.log(`✔ On branch ${branch}.`);
      })
    );
}
