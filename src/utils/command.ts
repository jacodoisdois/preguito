import * as gitOps from "../git/operations.js";
import { PrequitoError } from "./errors.js";

export async function requireGitRepo(): Promise<void> {
    if (!(await gitOps.isGitRepo())) {
        throw new PrequitoError("Not inside a git repository.");
    }
}

export function withErrorHandling<TArgs extends unknown[]>(
    fn: (...args: TArgs) => Promise<void>
): (...args: TArgs) => Promise<void> {
    return async (...args: TArgs) => {
        try {
            await fn(...args);
        } catch (error) {
            if (error instanceof PrequitoError) {
                console.error(`✖ ${error.message}`);
                process.exit(1);
            }
            throw error;
        }
    };
}

export function parseCount(
    value: string | undefined,
    defaultValue: number = 1
): number {
    if (value === undefined) return defaultValue;
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
        throw new PrequitoError("Count must be a positive integer.");
    }
    return num;
}
