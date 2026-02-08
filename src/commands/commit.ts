import { Command } from "commander";
import { loadConfigOrDefault } from "../config/loader.js";
import {
  parseTemplate,
  renderTemplate,
  mergeContext,
} from "../template/engine.js";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerCommitCommand(program: Command): void {
  program
    .command("c")
    .alias("commit")
    .description("Create a commit using your template")
    .requiredOption("-m, --message <text>", "The commit message body")
    .option("-p, --push", "Push after committing")
    .option("-f, --force", "Push with --force-with-lease after committing")
    .option("-d, --dry-run", "Show the generated message without executing")
    .option("-S, --no-stage", "Skip auto-staging (git add -A)")
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .action(async (opts, cmd) => {
      try {
        await executeCommit(opts, cmd);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`Error: ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeCommit(
  opts: Record<string, unknown>,
  cmd: Command
): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("Error: Not inside a git repository.");
    process.exit(1);
  }

  const config = await loadConfigOrDefault();
  const dynamicVars = parseDynamicFlags(cmd.args);
  const context = mergeContext(config.defaults, dynamicVars);
  const commitMessage = renderTemplate(
    config.template,
    context,
    opts.message as string
  );

  if (opts.dryRun) {
    console.log(commitMessage);
    return;
  }

  // Stage changes (unless --no-stage)
  if (opts.stage !== false) {
    await gitOps.stageAll();
  }

  if (!(await gitOps.hasStagedChanges())) {
    console.error("Error: No staged changes to commit.");
    process.exit(1);
  }

  console.log(`Committing: ${commitMessage}`);
  await gitOps.commit(commitMessage);
  console.log("Committed.");

  if (opts.force) {
    console.log("Pushing (--force-with-lease)...");
    await gitOps.forcePushLease();
    console.log("Pushed.");
  } else if (opts.push) {
    console.log("Pushing...");
    await gitOps.push();
    console.log("Pushed.");
  }
}

function parseDynamicFlags(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--") && i + 1 < args.length) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (!value.startsWith("--")) {
        result[key] = value;
        i++;
      }
    }
  }
  return result;
}
