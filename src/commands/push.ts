import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { spinner } from "../utils/spinner.js";

export function registerPushCommands(program: Command): void {
  program
    .command("p")
    .alias("push")
    .description("Push current branch (git push)")
    .action(async () => {
      try {
        await executePush();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("pu")
    .description("Push + set upstream (git push --set-upstream origin <branch>)")
    .action(async () => {
      try {
        await pushUpstream();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executePush(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const stop = spinner("Pushing...");
  await gitOps.push();
  stop("✔ Pushed.");
}

async function pushUpstream(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const branch = await gitOps.getCurrentBranch();
  const stop = spinner(`Pushing with --set-upstream origin ${branch}...`);
  await gitOps.pushUpstream(branch);
  stop("✔ Pushed.");
}
