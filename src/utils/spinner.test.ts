import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { spinner } from "./spinner.js";

describe("spinner", () => {
  let originalIsTTY: boolean | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(console, "log").mockImplementation(() => {});
    originalIsTTY = process.stdout.isTTY;
    // Default to TTY mode for most tests
    Object.defineProperty(process.stdout, "isTTY", {
      value: true,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    // Restore original isTTY value
    Object.defineProperty(process.stdout, "isTTY", {
      value: originalIsTTY,
      writable: true,
      configurable: true,
    });
  });

  describe("TTY mode (interactive terminal)", () => {
    it("should write initial frame with message and ANSI clear code", () => {
      spinner("Loading...");
      expect(process.stdout.write).toHaveBeenCalledWith("\r\x1b[K⠋ Loading...");
    });

    it("should animate through frames on interval with ANSI codes", () => {
      spinner("Working...");

      vi.advanceTimersByTime(80);
      expect(process.stdout.write).toHaveBeenCalledWith("\r\x1b[K⠙ Working...");

      vi.advanceTimersByTime(80);
      expect(process.stdout.write).toHaveBeenCalledWith("\r\x1b[K⠹ Working...");
    });

    it("should stop and print done message with ANSI codes", () => {
      const stop = spinner("Pushing...");
      stop("✔ Pushed.");

      expect(process.stdout.write).toHaveBeenCalledWith("\r\x1b[K✔ Pushed.\n");
    });

    it("should stop the interval after calling stop", () => {
      const stop = spinner("Pushing...");
      stop("✔ Done.");

      vi.advanceTimersByTime(500);
      const calls = (process.stdout.write as ReturnType<typeof vi.fn>).mock
        .calls;
      const afterStopCalls = calls.filter(
        ([text]: [string]) =>
          text !== "\r\x1b[K⠋ Pushing..." && text !== "\r\x1b[K✔ Done.\n"
      );
      expect(afterStopCalls).toHaveLength(0);
    });

    it("should cycle back to first frame after all frames", () => {
      spinner("Cycling...");

      // 10 frames × 80ms = 800ms to complete one full cycle
      vi.advanceTimersByTime(800);
      expect(process.stdout.write).toHaveBeenCalledWith(
        "\r\x1b[K⠋ Cycling..."
      );
    });

    it("should cleanup on SIGINT signal", () => {
      spinner("Running...");

      // Trigger SIGINT
      process.emit("SIGINT" as NodeJS.Signals);

      // Should clear the line
      expect(process.stdout.write).toHaveBeenCalledWith("\r\x1b[K");
    });

    it("should cleanup on SIGTERM signal", () => {
      spinner("Running...");

      // Trigger SIGTERM
      process.emit("SIGTERM" as NodeJS.Signals);

      // Should clear the line
      expect(process.stdout.write).toHaveBeenCalledWith("\r\x1b[K");
    });

    it("should remove signal listeners when stopped normally", () => {
      const stop = spinner("Running...");
      const listenerCountBefore = process.listenerCount("SIGINT");

      stop("✔ Done.");

      const listenerCountAfter = process.listenerCount("SIGINT");
      expect(listenerCountAfter).toBeLessThan(listenerCountBefore);
    });
  });

  describe("Non-TTY mode (CI/pipes)", () => {
    beforeEach(() => {
      // Set non-TTY environment
      Object.defineProperty(process.stdout, "isTTY", {
        value: false,
        writable: true,
        configurable: true,
      });
    });

    it("should not animate in non-TTY environment", () => {
      spinner("Loading...");

      // Should not write to stdout (no animation)
      expect(process.stdout.write).not.toHaveBeenCalled();
    });

    it("should print done message directly in non-TTY", () => {
      const stop = spinner("Loading...");
      stop("✔ Done.");

      expect(console.log).toHaveBeenCalledWith("✔ Done.");
      expect(process.stdout.write).not.toHaveBeenCalled();
    });

    it("should not create timers in non-TTY", () => {
      spinner("Loading...");

      vi.advanceTimersByTime(500);

      // No animation calls should happen
      expect(process.stdout.write).not.toHaveBeenCalled();
    });
  });

  describe("Explicit enabled option", () => {
    it("should respect enabled: false option", () => {
      const stop = spinner("Loading...", { enabled: false });

      expect(process.stdout.write).not.toHaveBeenCalled();

      stop("✔ Done.");

      expect(console.log).toHaveBeenCalledWith("✔ Done.");
    });

    it("should respect enabled: true option even in non-TTY", () => {
      Object.defineProperty(process.stdout, "isTTY", {
        value: false,
        writable: true,
        configurable: true,
      });

      spinner("Loading...", { enabled: true });

      expect(process.stdout.write).toHaveBeenCalledWith(
        "\r\x1b[K⠋ Loading..."
      );
    });
  });
});
