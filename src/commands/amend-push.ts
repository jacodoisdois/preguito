import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerAmendPushCommands(program: Command): void {
  program
    .command("ap")
    .description("Amend last commit + git push --force")
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
    .description("Amend last commit + git push --force-with-lease")
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

  console.log("→ Staging all changes...");
  await gitOps.stageAll();

  console.log("→ Amending last commit...");
  await gitOps.commitAmend();
  console.log("✔ Amended.");

  if (useLease) {
    console.log("→ Pushing (--force-with-lease)...");
    await gitOps.forcePushLease();
  } else {
    console.log("→ Pushing (--force)...");
    await gitOps.forcePush();
  }
  console.log("✔ Pushed.");
}
