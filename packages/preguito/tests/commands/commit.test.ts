import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { executeCommit } from "../../src/commands/commit.js";
import * as gitOps from "../../src/git/operations.js";
import { loadConfigOrDefault } from "../../src/config/loader.js";

vi.mock("../../src/git/operations.js");
vi.mock("../../src/config/loader.js");

describe("commit command with body", () => {
  const mockConfig = {
    template: "{{type}}: <message>",
    features: { cardId: false, type: true, environment: false },
    types: [{ key: "f", label: "feat" }],
    environments: [],
    defaults: {},
  };

  beforeEach(() => {
    vi.mocked(gitOps.isGitRepo).mockResolvedValue(true);
    vi.mocked(gitOps.hasStagedChanges).mockResolvedValue(true);
    vi.mocked(gitOps.stageAll).mockResolvedValue();
    vi.mocked(gitOps.commit).mockResolvedValue("success");
    vi.mocked(loadConfigOrDefault).mockResolvedValue(mockConfig);

    // Mock console methods
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("commits with title only when no body flag", async () => {
    await executeCommit(["f", "add feature"], {});
    expect(gitOps.commit).toHaveBeenCalledWith("feat: add feature");
  });

  it("commits with title and body when body flag provided", async () => {
    await executeCommit(["f", "add feature"], {
      body: "Detailed explanation\nMore details",
    });
    expect(gitOps.commit).toHaveBeenCalledWith(
      "feat: add feature\n\nDetailed explanation\nMore details"
    );
  });

  it("dry-run shows full message including body", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await executeCommit(["f", "add feature"], {
      dryRun: true,
      body: "Body text",
    });
    expect(consoleSpy).toHaveBeenCalledWith("feat: add feature\n\nBody text");
  });

  it("dry-run shows only title when no body", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    await executeCommit(["f", "simple commit"], { dryRun: true });
    expect(consoleSpy).toHaveBeenCalledWith("feat: simple commit");
  });

  it("handles multiline body with blank lines", async () => {
    await executeCommit(["f", "refactor"], {
      body: "Line 1\n\nLine 2\n\nLine 3",
    });
    expect(gitOps.commit).toHaveBeenCalledWith(
      "feat: refactor\n\nLine 1\n\nLine 2\n\nLine 3"
    );
  });

  it("empty body string results in title-only commit", async () => {
    await executeCommit(["f", "fix bug"], { body: "" });
    expect(gitOps.commit).toHaveBeenCalledWith("feat: fix bug");
  });
});
