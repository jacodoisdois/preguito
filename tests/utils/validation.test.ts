import { describe, it, expect } from "vitest";
import {
    validateHash,
    validateBranchName,
    validateTagName,
    validateRefName,
} from "../../src/utils/validation.js";

describe("validateHash", () => {
    it("accepts valid short hashes", () => {
        expect(() => validateHash("abcd")).not.toThrow();
        expect(() => validateHash("abc1234")).not.toThrow();
    });

    it("accepts valid full-length hashes", () => {
        expect(() =>
            validateHash("abc123def456abc123def456abc123def456abcd")
        ).not.toThrow();
    });

    it("accepts uppercase hex characters", () => {
        expect(() => validateHash("ABCDEF1234")).not.toThrow();
    });

    it("accepts mixed case hex characters", () => {
        expect(() => validateHash("aBcDeF1234")).not.toThrow();
    });

    it("rejects hashes shorter than 4 characters", () => {
        expect(() => validateHash("abc")).toThrow("Invalid git hash");
    });

    it("rejects hashes longer than 40 characters", () => {
        expect(() =>
            validateHash("abc123def456abc123def456abc123def456abcde")
        ).toThrow("Invalid git hash");
    });

    it("rejects hashes with non-hex characters", () => {
        expect(() => validateHash("abcg1234")).toThrow("Invalid git hash");
    });

    it("rejects empty strings", () => {
        expect(() => validateHash("")).toThrow("Invalid git hash");
    });

    it("rejects hashes with shell injection attempts", () => {
        expect(() => validateHash("abc1234'; rm -rf /; echo '")).toThrow(
            "Invalid git hash"
        );
    });

    it("rejects hashes with spaces", () => {
        expect(() => validateHash("abc 1234")).toThrow("Invalid git hash");
    });
});

describe("validateRefName", () => {
    it("accepts valid ref names", () => {
        expect(() => validateRefName("main", "Branch")).not.toThrow();
        expect(() => validateRefName("feature/login", "Branch")).not.toThrow();
        expect(() => validateRefName("v1.0.0", "Tag")).not.toThrow();
    });

    it("rejects empty strings", () => {
        expect(() => validateRefName("", "Branch")).toThrow("cannot be empty");
    });

    it("rejects whitespace-only strings", () => {
        expect(() => validateRefName("   ", "Branch")).toThrow("cannot be empty");
    });

    it("rejects names starting with -", () => {
        expect(() => validateRefName("-flag", "Branch")).toThrow(
            "Cannot start with '-'"
        );
    });

    it("rejects names ending with .", () => {
        expect(() => validateRefName("branch.", "Branch")).toThrow(
            "Cannot end with '.'"
        );
    });

    it("rejects names ending with /", () => {
        expect(() => validateRefName("branch/", "Branch")).toThrow(
            "Cannot end with '/'"
        );
    });

    it("rejects names with ..", () => {
        expect(() => validateRefName("a..b", "Branch")).toThrow(
            "forbidden pattern"
        );
    });

    it("rejects names with .lock suffix", () => {
        expect(() => validateRefName("branch.lock", "Branch")).toThrow(
            "forbidden pattern"
        );
    });

    it("rejects names with @{", () => {
        expect(() => validateRefName("branch@{0}", "Branch")).toThrow(
            "forbidden pattern"
        );
    });

    it("rejects names with spaces", () => {
        expect(() => validateRefName("my branch", "Branch")).toThrow(
            "forbidden characters"
        );
    });

    it("rejects names with ~", () => {
        expect(() => validateRefName("branch~1", "Branch")).toThrow(
            "forbidden characters"
        );
    });

    it("rejects names with ^", () => {
        expect(() => validateRefName("branch^", "Branch")).toThrow(
            "forbidden characters"
        );
    });

    it("rejects names with :", () => {
        expect(() => validateRefName("branch:name", "Branch")).toThrow(
            "forbidden characters"
        );
    });

    it("rejects names with backslash", () => {
        expect(() => validateRefName("branch\\name", "Branch")).toThrow(
            "forbidden characters"
        );
    });

    it("rejects names with [", () => {
        expect(() => validateRefName("branch[0]", "Branch")).toThrow(
            "forbidden characters"
        );
    });

    it("rejects names with control characters", () => {
        expect(() => validateRefName("branch\x00name", "Branch")).toThrow(
            "forbidden characters"
        );
    });
});

describe("validateBranchName", () => {
    it("delegates to validateRefName with 'Branch' type", () => {
        expect(() => validateBranchName("feature/login")).not.toThrow();
        expect(() => validateBranchName("-bad")).toThrow("Branch");
    });
});

describe("validateTagName", () => {
    it("delegates to validateRefName with 'Tag' type", () => {
        expect(() => validateTagName("v1.0.0")).not.toThrow();
        expect(() => validateTagName("-bad")).toThrow("Tag");
    });
});
