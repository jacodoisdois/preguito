import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";

export function registerFindCommands(program: Command): void {
  program
    .command("f <keyword>")
    .alias("find")
    .description("Search commits by message (e.g. guito f \"login\")")
    .option("-n, --number <count>", "Limit number of results")
    .action(
      withErrorHandling(async (keyword: string, opts: { number?: string }) => {
        await requireGitRepo();

        const count = opts.number ? parseInt(opts.number, 10) : undefined;
        const output = await gitOps.logGrep(keyword, count);
        if (output) {
          console.log(output.trimEnd());
        } else {
          console.log(`✨ No commits found matching "${keyword}".`);
        }
      })
    );

  program
    .command("t <tag>")
    .alias("tag")
    .description("Commits since <tag> (e.g. guito t v1.0.0)")
    .option("-a, --all", "Show all commits reachable from the tag")
    .action(
      withErrorHandling(async (tag: string, opts: { all?: boolean }) => {
        await requireGitRepo();

        if (opts.all) {
          console.log(`🏷️  Commits reachable from ${tag}:`);
          const output = await gitOps.logTagAll(tag);
          if (output) {
            console.log(output.trimEnd());
          } else {
            console.log("✨ No commits found.");
          }
        } else {
          console.log(`🏷️  Commits since ${tag}:`);
          const output = await gitOps.logTag(tag);
          if (output) {
            console.log(output.trimEnd());
          } else {
            console.log("✨ No commits since this tag.");
          }
        }
      })
    );
}
