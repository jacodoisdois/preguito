import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";
import { spinner } from "../utils/spinner.js";

export function registerPushCommands(program: Command): void {
  program
    .command("p")
    .alias("push")
    .description("Push current branch (git push)")
    .action(
      withErrorHandling(async () => {
        await requireGitRepo();

        const stop = spinner("Pushing...");
        await gitOps.push();
        stop("✔ Pushed.");
      })
    );

  program
    .command("pu")
    .description("Push + set upstream (git push --set-upstream origin <branch>)")
    .action(
      withErrorHandling(async () => {
        await requireGitRepo();

        const branch = await gitOps.getCurrentBranch();
        const stop = spinner(`Pushing with --set-upstream origin ${branch}...`);
        await gitOps.pushUpstream(branch);
        stop("✔ Pushed.");
      })
    );
}
