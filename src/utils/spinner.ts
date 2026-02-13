const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

interface SpinnerOptions {
  enabled?: boolean;
}

export function spinner(
  message: string,
  options?: SpinnerOptions
): (doneMessage: string) => void {
  // Auto-detect TTY (disable in CI/pipes)
  const enabled = options?.enabled ?? (process.stdout.isTTY ?? false);

  // Non-TTY mode: just print messages directly
  if (!enabled) {
    return (doneMessage: string): void => {
      console.log(doneMessage);
    };
  }

  // TTY mode: animate spinner
  let frameIndex = 0;

  const write = (text: string): void => {
    // \r = return to start, \x1b[K = clear to end of line
    process.stdout.write(`\r\x1b[K${text}`);
  };

  write(`${FRAMES[frameIndex]} ${message}`);

  const timer = setInterval(() => {
    frameIndex = (frameIndex + 1) % FRAMES.length;
    write(`${FRAMES[frameIndex]} ${message}`);
  }, INTERVAL_MS);

  // Cleanup handler for Ctrl+C
  const cleanup = (): void => {
    clearInterval(timer);
    process.stdout.write("\r\x1b[K"); // Clear the line
  };

  process.once("SIGINT", cleanup);
  process.once("SIGTERM", cleanup);

  return (doneMessage: string): void => {
    clearInterval(timer);
    process.removeListener("SIGINT", cleanup);
    process.removeListener("SIGTERM", cleanup);
    write(`${doneMessage}\n`);
  };
}
