import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { spinner } from "../utils/spinner.js";

export function registerSwitchCommand(program: Command): void {
  program
    .command("sw <branch>")
    .alias("switch")
    .description("Switch branch, -n to create (e.g. guito sw -n feature/x)")
    .option("-n, --new", "Create a new branch")
    .action(async (branch: string, opts: Record<string, unknown>) => {
      try {
        await executeSwitch(branch, opts);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeSwitch(
  branch: string,
  opts: Record<string, unknown>
): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const message = opts.new
    ? `Creating and switching to ${branch}...`
    : `Switching to ${branch}...`;

  const stop = spinner(message);

  if (opts.new) {
    await gitOps.createBranch(branch);
  } else {
    await gitOps.checkout(branch);
  }

  stop(`✔ On branch ${branch}.`);
}
