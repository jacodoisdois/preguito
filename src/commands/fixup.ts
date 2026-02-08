import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerFixupCommand(program: Command): void {
  program
    .command("cf <hash>")
    .description("Create a fixup commit targeting a specific commit")
    .option("-p, --push", "Push after creating the fixup commit")
    .option("-f, --force", "Push with --force-with-lease after creating")
    .action(async (hash: string, opts: Record<string, unknown>) => {
      try {
        await executeFixup(hash, opts);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeFixup(
  hash: string,
  opts: Record<string, unknown>
): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  console.log("→ Staging all changes...");
  await gitOps.stageAll();

  if (!(await gitOps.hasStagedChanges())) {
    console.error("✖ No staged changes to commit.");
    process.exit(1);
  }

  console.log(`→ Creating fixup commit for ${hash}...`);
  await gitOps.commitFixup(hash);
  console.log("✔ Fixup commit created.");

  if (opts.force) {
    console.log("→ Pushing (--force-with-lease)...");
    await gitOps.forcePushLease();
    console.log("✔ Pushed.");
  } else if (opts.push) {
    console.log("→ Pushing...");
    await gitOps.push();
    console.log("✔ Pushed.");
  }
}
