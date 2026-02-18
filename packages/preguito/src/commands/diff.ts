import { Command } from "commander";
import * as gitOps from "../git/operations.js";
import { requireGitRepo, withErrorHandling } from "../utils/command.js";

interface DiffOptions {
    staged?: boolean;
    stat?: boolean;
    nameOnly?: boolean;
}

export function registerDiffCommand(program: Command): void {
    program
        .command("d")
        .alias("diff")
        .description("Show changes (git diff)")
        .option("-s, --staged", "Show staged changes only")
        .option("--stat", "Show diffstat summary")
        .option("-n, --name-only", "Show only names of changed files")
        .action(
            withErrorHandling(async (opts: DiffOptions) => {
                await requireGitRepo();

                const options: string[] = [];
                if (opts.staged) options.push("--staged");
                if (opts.stat) options.push("--stat");
                if (opts.nameOnly) options.push("--name-only");

                const output = await gitOps.diff(options);
                if (output) {
                    console.log(output.trimEnd());
                } else {
                    console.log("✨ No changes.");
                }
            })
        );
}
