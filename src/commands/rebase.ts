import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { spinner } from "../utils/spinner.js";

export function registerRebaseCommands(program: Command): void {
  program
    .command("r <branch>")
    .alias("rebase")
    .description(
      "Rebase on <branch> (checkout, pull, rebase) (e.g. guito r main)"
    )
    .action(async (branch: string) => {
      try {
        await quickRebase(branch);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("ri <count>")
    .description(
      "Interactive rebase last <count> commits (e.g. guito ri 3)"
    )
    .action(async (count: string) => {
      try {
        await interactiveRebase(count);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("re <hash>")
    .description("Edit rebase at <hash> (e.g. guito re abc123)")
    .action(async (hash: string) => {
      try {
        await editRebase(hash);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function quickRebase(branch: string): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const currentBranch = await gitOps.getCurrentBranch();
  console.log(`→ Current branch: ${currentBranch}`);

  let stop = spinner(`Checking out ${branch}...`);
  await gitOps.checkout(branch);
  stop(`✔ Checked out ${branch}.`);

  stop = spinner(`Pulling ${branch}...`);
  await gitOps.pull();
  stop(`✔ Pulled ${branch}.`);

  stop = spinner(`Checking out ${currentBranch}...`);
  await gitOps.checkout(currentBranch);
  stop(`✔ Checked out ${currentBranch}.`);

  stop = spinner(`Rebasing ${currentBranch} onto ${branch}...`);
  await gitOps.rebase(branch);
  stop("✔ Rebase complete.");
}

async function interactiveRebase(count: string): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const num = parseInt(count, 10);
  if (isNaN(num) || num <= 0) {
    console.error("✖ Count must be a positive integer.");
    process.exit(1);
  }

  console.log(`→ Starting interactive rebase for the last ${num} commit(s)...`);
  await gitOps.rebaseInteractive(num);
}

async function editRebase(hash: string): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  console.log(`→ Starting edit rebase on commit ${hash}...`);
  await gitOps.rebaseInteractiveEdit(hash);
  console.log(
    "✔ Rebase paused at the target commit. Make your changes, then run:"
  );
  console.log("  git add . && git rebase --continue");
}
