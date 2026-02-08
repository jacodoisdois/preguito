import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import { GitOperationError } from "../utils/errors.js";

const execFileAsync = promisify(execFile);

interface GitResult {
  stdout: string;
  stderr: string;
}

async function git(
  args: string[],
  env?: Record<string, string>
): Promise<GitResult> {
  try {
    const result = await execFileAsync("git", args, {
      maxBuffer: 10 * 1024 * 1024,
      env: env ? { ...process.env, ...env } : undefined,
    });
    return { stdout: result.stdout, stderr: result.stderr };
  } catch (error: unknown) {
    const err = error as {
      code?: number;
      stderr?: string;
      message?: string;
    };
    throw new GitOperationError(
      args[0],
      err.code ?? 1,
      err.stderr ?? err.message ?? "Unknown git error"
    );
  }
}

export async function isGitRepo(): Promise<boolean> {
  try {
    await git(["rev-parse", "--is-inside-work-tree"]);
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentBranch(): Promise<string> {
  const result = await git(["branch", "--show-current"]);
  return result.stdout.trim();
}

export async function hasStagedChanges(): Promise<boolean> {
  try {
    await git(["diff", "--cached", "--quiet"]);
    return false; // exit 0 = no diff = no staged changes
  } catch {
    return true; // exit 1 = there are staged changes
  }
}

export async function stageAll(): Promise<void> {
  await git(["add", "-A"]);
}

export async function commit(message: string): Promise<string> {
  const result = await git(["commit", "-m", message]);
  return result.stdout;
}

export async function commitAmend(): Promise<string> {
  const result = await git(["commit", "--amend", "--no-edit"]);
  return result.stdout;
}

export async function push(): Promise<string> {
  const result = await git(["push"]);
  return result.stdout + result.stderr;
}

export async function forcePush(): Promise<string> {
  const result = await git(["push", "--force"]);
  return result.stdout + result.stderr;
}

export async function forcePushLease(): Promise<string> {
  const result = await git(["push", "--force-with-lease"]);
  return result.stdout + result.stderr;
}

export async function checkout(branch: string): Promise<void> {
  await git(["checkout", branch]);
}

export async function pull(): Promise<string> {
  const result = await git(["pull"]);
  return result.stdout + result.stderr;
}

export async function rebase(branch: string): Promise<string> {
  const result = await git(["rebase", branch]);
  return result.stdout + result.stderr;
}

export async function rebaseInteractiveEdit(hash: string): Promise<string> {
  // Use GIT_SEQUENCE_EDITOR to automatically change "pick <hash>" to "edit <hash>"
  const sedCmd = `sed -i 's/^pick ${hash.slice(0, 7)}/edit ${hash.slice(0, 7)}/'`;
  const result = await git(["rebase", "-i", `${hash}^`], {
    GIT_SEQUENCE_EDITOR: sedCmd,
  });
  return result.stdout + result.stderr;
}

export async function status(): Promise<string> {
  const result = await git(["status", "--short"]);
  return result.stdout;
}

async function gitInteractive(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("git", args, { stdio: "inherit" });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new GitOperationError(
            args[0],
            code ?? 1,
            "Interactive git command failed"
          )
        );
    });
  });
}

export async function rebaseInteractive(count: number): Promise<void> {
  await gitInteractive(["rebase", "-i", `HEAD~${count}`]);
}

export async function pushUpstream(branch?: string): Promise<string> {
  const targetBranch = branch ?? (await getCurrentBranch());
  const result = await git(["push", "--set-upstream", "origin", targetBranch]);
  return result.stdout + result.stderr;
}

export async function commitFixup(hash: string): Promise<string> {
  const result = await git(["commit", "--fixup", hash]);
  return result.stdout;
}

export async function resetSoft(count: number = 1): Promise<string> {
  const result = await git(["reset", "--soft", `HEAD~${count}`]);
  return result.stdout;
}

export async function createBranch(branch: string): Promise<void> {
  await git(["checkout", "-b", branch]);
}

export async function stash(): Promise<string> {
  const result = await git(["stash"]);
  return result.stdout;
}

export async function stashPop(): Promise<string> {
  const result = await git(["stash", "pop"]);
  return result.stdout;
}

export async function logOneline(count: number = 10): Promise<string> {
  const result = await git(["log", "--oneline", "-n", String(count)]);
  return result.stdout;
}

export async function logGrep(
  keyword: string,
  count?: number
): Promise<string> {
  const args = ["log", "--oneline", "--all", `--grep=${keyword}`];
  if (count) args.push("-n", String(count));
  const result = await git(args);
  return result.stdout;
}

export async function logTag(tag: string): Promise<string> {
  const result = await git(["log", "--oneline", `${tag}..HEAD`]);
  return result.stdout;
}

export async function logTagAll(tag: string): Promise<string> {
  const result = await git(["log", "--oneline", tag]);
  return result.stdout;
}
