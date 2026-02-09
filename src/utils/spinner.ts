const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INTERVAL_MS = 80;

export function spinner(message: string): (doneMessage: string) => void {
  let frameIndex = 0;

  const write = (text: string): void => {
    process.stdout.write(`\r${text}`);
  };

  write(`${FRAMES[frameIndex]} ${message}`);

  const timer = setInterval(() => {
    frameIndex = (frameIndex + 1) % FRAMES.length;
    write(`${FRAMES[frameIndex]} ${message}`);
  }, INTERVAL_MS);

  return (doneMessage: string): void => {
    clearInterval(timer);
    write(`${doneMessage}\n`);
  };
}
