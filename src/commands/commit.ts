import { Command } from "commander";
import { loadConfigOrDefault } from "../config/loader.js";
import { renderTemplate } from "../template/engine.js";
import { parsePositionalArgs } from "./commit-parser.js";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";
import { spinner } from "../utils/spinner.js";

export function registerCommitCommand(program: Command): void {
  program
    .command("c")
    .alias("commit")
    .description("Templated commit (e.g. guito c 42 f \"msg\" -p)")
    .argument("[args...]", "Card ID, shortcodes, and message")
    .option("-p, --push", "Push after committing")
    .option("-f, --force", "Push with --force-with-lease after committing")
    .option("-d, --dry-run", "Show the generated message without executing")
    .option("-S, --no-stage", "Skip auto-staging (git add -A)")
    .option("-b, --body <text>", "Commit body (optional, multi-line description)")
    .action(async (args: string[], opts: Record<string, unknown>) => {
      try {
        await executeCommit(args, opts);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`\u2716 ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

export async function executeCommit(
  args: string[],
  opts: Record<string, unknown>
): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("\u2716 Not inside a git repository.");
    process.exit(1);
  }

  const config = await loadConfigOrDefault();
  const bodyText = typeof opts.body === "string" ? opts.body : undefined;
  const { context, message, body } = parsePositionalArgs(args, config, bodyText);
  const commitTitle = renderTemplate(config.template, context, message);

  // Construct full commit message
  const commitMessage = body ? `${commitTitle}\n\n${body}` : commitTitle;

  if (opts.dryRun) {
    console.log(commitMessage);
    return;
  }

  if (opts.stage !== false) {
    await gitOps.stageAll();
  }

  if (!(await gitOps.hasStagedChanges())) {
    console.error("\u2716 No staged changes to commit.");
    process.exit(1);
  }

  // Show only title in spinner (body may be long)
  const stopCommit = spinner(`Committing: ${commitTitle}`);
  await gitOps.commit(commitMessage);
  stopCommit("\u2714 Committed.");

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
