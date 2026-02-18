import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { spinner } from "../../src/utils/spinner.js";

const ESC = "\r\x1b[K";

describe("spinner", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        // Simulate TTY so the spinner animation is enabled
        Object.defineProperty(process.stdout, "isTTY", { value: true, configurable: true });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("should write initial frame with message", () => {
        spinner("Loading...");
        expect(process.stdout.write).toHaveBeenCalledWith(`${ESC}⠋ Loading...`);
    });

    it("should animate through frames on interval", () => {
        spinner("Working...");

        vi.advanceTimersByTime(80);
        expect(process.stdout.write).toHaveBeenCalledWith(`${ESC}⠙ Working...`);

        vi.advanceTimersByTime(80);
        expect(process.stdout.write).toHaveBeenCalledWith(`${ESC}⠹ Working...`);
    });

    it("should stop and print done message", () => {
        const stop = spinner("Pushing...");
        stop("✔ Pushed.");

        expect(process.stdout.write).toHaveBeenCalledWith(`${ESC}✔ Pushed.\n`);
    });

    it("should stop the interval after calling stop", () => {
        const stop = spinner("Pushing...");
        stop("✔ Done.");

        vi.advanceTimersByTime(500);
        const calls = (process.stdout.write as ReturnType<typeof vi.fn>).mock.calls;
        const afterStopCalls = calls.filter(
            ([text]: string[]) => text !== `${ESC}⠋ Pushing...` && text !== `${ESC}✔ Done.\n`
        );
        expect(afterStopCalls).toHaveLength(0);
    });

    it("should cycle back to first frame after all frames", () => {
        spinner("Cycling...");

        // 10 frames × 80ms = 800ms to complete one full cycle
        vi.advanceTimersByTime(800);
        expect(process.stdout.write).toHaveBeenCalledWith(`${ESC}⠋ Cycling...`);
    });

    it("should fall back to console.log in non-TTY mode", () => {
        Object.defineProperty(process.stdout, "isTTY", { value: false, configurable: true });
        vi.spyOn(console, "log").mockImplementation(() => { });

        const stop = spinner("Working...");
        stop("✔ Done.");

        expect(console.log).toHaveBeenCalledWith("✔ Done.");
        // stdout.write should not have been called for animation
        expect(process.stdout.write).not.toHaveBeenCalled();
    });
});
