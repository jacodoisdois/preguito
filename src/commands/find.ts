import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { PrequitoError } from "../utils/errors.js";

export function registerFindCommands(program: Command): void {
  program
    .command("f <keyword>")
    .alias("find")
    .description("Search commits by message keyword")
    .option("-n, --number <count>", "Limit number of results")
    .action(async (keyword: string, opts: Record<string, unknown>) => {
      try {
        await executeFind(keyword, opts);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });

  program
    .command("t <tag>")
    .alias("tag")
    .description("Show commits for a tag (default: tag..HEAD, --all: all commits reachable from tag)")
    .option("-a, --all", "Show all commits reachable from the tag")
    .action(async (tag: string, opts: Record<string, unknown>) => {
      try {
        await executeTag(tag, opts);
      } catch (error) {
        if (error instanceof PrequitoError) {
          console.error(`✖ ${error.message}`);
          process.exit(1);
        }
        throw error;
      }
    });
}

async function executeFind(
  keyword: string,
  opts: Record<string, unknown>
): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  const count = opts.number ? parseInt(opts.number as string, 10) : undefined;
  const output = await gitOps.logGrep(keyword, count);
  if (output) {
    console.log(output.trimEnd());
  } else {
    console.log(`✨ No commits found matching "${keyword}".`);
  }
}

async function executeTag(
  tag: string,
  opts: Record<string, unknown>
): Promise<void> {
  if (!(await gitOps.isGitRepo())) {
    console.error("✖ Not inside a git repository.");
    process.exit(1);
  }

  if (opts.all) {
    console.log(`Commits reachable from ${tag}:`);
    const output = await gitOps.logTagAll(tag);
    if (output) {
      console.log(output.trimEnd());
    } else {
      console.log("✨ No commits found.");
    }
  } else {
    console.log(`Commits since ${tag}:`);
    const output = await gitOps.logTag(tag);
    if (output) {
      console.log(output.trimEnd());
    } else {
      console.log("✨ No commits since this tag.");
    }
  }
}
