import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";
import { spinner } from "../utils/spinner.js";

interface FixupOptions {
  push?: boolean;
  force?: boolean;
}

export function registerFixupCommand(program: Command): void {
  program
    .command("cf <hash>")
    .description("Fixup commit for <hash> (e.g. guito cf abc123 -f)")
    .option("-p, --push", "Push after creating the fixup commit")
    .option("-f, --force", "Push with --force-with-lease after creating")
    .action(withErrorHandling(executeFixup));
}

async function executeFixup(
  hash: string,
  opts: FixupOptions
): Promise<void> {
  await requireGitRepo();

  const stopStage = spinner("Staging all changes...");
  await gitOps.stageAll();
  stopStage("✔ Staged.");

  if (!(await gitOps.hasStagedChanges())) {
    throw new PrequitoError("No staged changes to commit.");
  }

  const stopCommit = spinner(`Creating fixup commit for ${hash}...`);
  await gitOps.commitFixup(hash);
  stopCommit("✔ Fixup commit created.");

  if (opts.force) {
    const stop = spinner("Pushing (--force-with-lease)...");
    await gitOps.forcePushLease();
    stop("✔ Pushed.");
  } else if (opts.push) {
    const stop = spinner("Pushing...");
    await gitOps.push();
    stop("✔ Pushed.");
  }
}
