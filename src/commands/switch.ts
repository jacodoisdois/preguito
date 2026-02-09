import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

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

  if (opts.new) {
    console.log(`→ Creating and switching to ${branch}...`);
    await gitOps.createBranch(branch);
  } else {
    console.log(`→ Switching to ${branch}...`);
    await gitOps.checkout(branch);
  }
  console.log(`✔ On branch ${branch}.`);
}
