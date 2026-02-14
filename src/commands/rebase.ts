import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling, parseCount } from "../utils/command.js";
import { spinner } from "../utils/spinner.js";

export function registerRebaseCommands(program: Command): void {
  program
    .command("r <branch>")
    .alias("rebase")
    .description(
      "Rebase on <branch> (checkout, pull, rebase) (e.g. guito r main)"
    )
    .action(withErrorHandling(quickRebase));

  program
    .command("ri <count>")
    .description(
      "Interactive rebase last <count> commits (e.g. guito ri 3)"
    )
    .action(withErrorHandling(interactiveRebase));

  program
    .command("re <hash>")
    .description("Edit rebase at <hash> (e.g. guito re abc123)")
    .action(withErrorHandling(editRebase));
}

async function quickRebase(branch: string): Promise<void> {
  await requireGitRepo();

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
  await requireGitRepo();

  const num = parseCount(count);
  console.log(`→ Starting interactive rebase for the last ${num} commit(s)...`);
  await gitOps.rebaseInteractive(num);
}

async function editRebase(hash: string): Promise<void> {
  await requireGitRepo();

  console.log(`→ Starting edit rebase on commit ${hash}...`);
  await gitOps.rebaseInteractiveEdit(hash);
  console.log(
    "✔ Rebase paused at the target commit. Make your changes, then run:"
  );
  console.log("  git add . && git rebase --continue");
}
