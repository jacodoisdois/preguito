import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";
import { spinner } from "../utils/spinner.js";

export function registerAmendPushCommands(program: Command): void {
  program
    .command("ap")
    .description("Amend last commit + force push (git push --force)")
    .action(withErrorHandling(() => amendAndPush(false)));

  program
    .command("apl")
    .description("Amend last commit + safe force push (--force-with-lease)")
    .action(withErrorHandling(() => amendAndPush(true)));
}

async function amendAndPush(useLease: boolean): Promise<void> {
  await requireGitRepo();

  const stopStage = spinner("Staging all changes...");
  await gitOps.stageAll();
  stopStage("✔ Staged.");

  const stopAmend = spinner("Amending last commit...");
  await gitOps.commitAmend();
  stopAmend("✔ Amended.");

  if (useLease) {
    const stop = spinner("Pushing (--force-with-lease)...");
    await gitOps.forcePushLease();
    stop("✔ Pushed.");
  } else {
    const stop = spinner("Pushing (--force)...");
    await gitOps.forcePush();
    stop("✔ Pushed.");
  }
}
