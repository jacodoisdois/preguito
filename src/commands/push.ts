import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerPushCommands(program: Command): void {
  program
    .command("pu")
    .description("Push current branch and set upstream tracking")
    .action(async () => {
      try {
        await pushUpstream();
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function pushUpstream(): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("Error: Not inside a git repository.");
    process.exit(1);
  }

  const branch = await gitOps.getCurrentBranch();
  console.log(`Pushing with --set-upstream origin ${branch}...`);
  await gitOps.pushUpstream(branch);
  console.log("Pushed.");
}
