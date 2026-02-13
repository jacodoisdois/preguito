import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { spinner } from "../utils/spinner.js";

export function registerAmendPushCommands(program: Command): void {
  program
    .command("ap")
    .description("Amend last commit + force push (git push --force)")
    .action(async () => {
      try {
        await amendAndPush(false);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("apl")
    .description("Amend last commit + safe force push (--force-with-lease)")
    .action(async () => {
      try {
        await amendAndPush(true);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function amendAndPush(useLease: boolean): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

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
