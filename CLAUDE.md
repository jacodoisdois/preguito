# Claude Code Configuration for preguito

## Project Overview

**preguito** is a lazy Git CLI tool that provides commit templates and shortcuts to streamline Git workflows. Built with TypeScript, it helps teams maintain consistent commit messages while reducing repetitive typing.

**Key Features:**
- Customizable commit templates with variable substitution
- Git command shortcuts (commit, push, rebase, stash, etc.)
- Per-project and global configuration support
- Standalone binary via Node.js SEA

## Tech Stack

- **Language:** TypeScript 5.7+ (strict mode)
- **CLI Framework:** Commander.js 13
- **Build Tool:** tsdown (Rolldown-based)
- **Testing:** Vitest 3.0
- **Runtime:** Node.js >= 20.0.0
- **Package Manager:** npm

## Code Quality Standards

### TypeScript
- **Strict mode:** Always enabled (`tsc --noEmit` must pass)
- **No `any` types:** Use proper typing or `unknown` with type guards
- **Prefer type inference:** Explicit types only when necessary
- **ESM only:** All imports use `.js` extensions in source

### Code Style
- **Formatting:** Consistent with existing codebase
- **Naming:**
  - Functions: `camelCase`
  - Types/Interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE` (only for true constants)
- **File structure:** One main export per file when possible

### Testing
- **Framework:** Vitest (NOT Jest)
- **Coverage:** Aim for critical path coverage
- **Test location:** `src/**/*.test.ts` (co-located with source)
- **Test style:** Descriptive `describe` and `it` blocks
- **Always run tests:** After behavior changes, run `npm test`

### Git Workflow
- **Commits:** Use preguito itself for consistent messages
- **Branching:** Feature branches from `master`
- **No force push** to `master` without explicit approval
- **Hooks:** Respect pre-commit hooks (don't use `--no-verify`)

## Development Commands

```bash
# Development
npm run dev          # Watch mode (tsdown)
npm test            # Run all tests
npm run test:watch  # Watch mode for tests
npm run lint        # Type check (must pass)

# Building
npm run build       # Production build
npm run build:sea   # Standalone binary
npm run build:deb   # Debian package

# Using preguito locally
npm link            # Link for global usage
guito <command>     # Test CLI commands
```

## Project Structure

```
preguito/
├── src/
│   ├── cli.ts              # CLI entry point (Commander setup)
│   ├── commands/           # Command implementations
│   ├── config/             # Config loading and validation
│   ├── git/                # Git operations wrapper
│   ├── template/           # Template parsing and rendering
│   └── utils/              # Shared utilities
├── docs/                   # Documentation
├── scripts/                # Build scripts (SEA, deb)
└── debian/                 # Debian packaging files
```

## Installed Claude Code Skills

### Active Skills

**TypeScript Development:**
- `~/.claude/skills/mastering-typescript-skill/` - Enterprise TypeScript patterns
- `~/.claude/skills/svenja-typescript-quality/skills/strict-typescript-mode/` - Strict mode enforcement

**Code Quality:**
- `~/.claude/skills/svenja-typescript-quality/skills/code-quality-gate/` - Quality checks
- `~/.claude/skills/svenja-typescript-quality/skills/tdd-strict/` - Test-driven development

**Testing:**
- `~/.claude/skills/svenja-typescript-quality/skills/behavior-testing/` - BDD testing patterns
- `~/.claude/skills/svenja-typescript-quality/skills/testing-quality/` - QA standards

**Git & Release:**
- `~/.claude/skills/svenja-typescript-quality/skills/changelog-generator/` - Auto-generate changelogs
- `~/.claude/skills/svenja-typescript-quality/skills/safe-git-guard/` - Prevent destructive Git ops

**Documentation:**
- `~/.claude/skills/svenja-typescript-quality/skills/doc-generator/` - Auto-documentation

**Workflows:**
- `~/.claude/skills/skills-marketplace/engineering-workflow-plugin/` - Engineering workflows
- `~/.claude/skills/skills-marketplace/productivity-skills-plugin/` - Productivity tools

## Guidelines for Claude Code

### When Making Changes

1. **Read before edit:** Always read files before suggesting modifications
2. **Test changes:** Run `npm test` after behavior modifications
3. **Type check:** Run `npm run lint` before completing tasks
4. **Minimal changes:** Don't refactor unless explicitly requested
5. **No over-engineering:** Keep solutions simple and focused

### Testing Protocol

- **Always use Vitest** (project uses Vitest, not Jest)
- Add tests for new features or bug fixes
- Run full test suite before marking tasks complete
- If tests fail, fix them—don't skip or mark as done

### Commit Guidelines

When creating commits (with user approval):
- Use preguito's own CLI: `guito c -m "description"`
- Follow conventional commits: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Include ticket numbers if applicable
- Always add co-author: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

### Security Considerations

- **No command injection:** Sanitize all user inputs passed to child processes
- **Path validation:** Validate file paths to prevent directory traversal
- **Config validation:** Validate config files before loading
- **No secrets in commits:** Never commit `.env` files or credentials

### Documentation

- Update README.md for user-facing changes
- Update docs/ for detailed command documentation
- Add inline comments only for non-obvious logic
- JSDoc for public API functions

## Common Tasks

### Adding a New Command

1. Create command file in `src/commands/`
2. Import and register in `src/cli.ts`
3. Add tests in co-located `.test.ts` file
4. Document in `docs/commands/<command>.md`
5. Update main README.md command table

### Modifying Template System

1. Update parser in `src/template/`
2. Add tests for edge cases
3. Update `docs/template-system.md`
4. Ensure backward compatibility

## Versioning & Release Workflow

### Semantic Versioning Policy

Preguito follows [Semantic Versioning (semver)](https://semver.org/):

**Version format:** `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- **MAJOR** (1.0.0): Breaking changes - incompatible API changes
  - Examples: Removing commands, changing config format, breaking CLI args

- **MINOR** (0.2.0): New features - backwards-compatible functionality
  - Examples: New commands, new config options, new template variables

- **PATCH** (0.1.1): Bug fixes - backwards-compatible fixes
  - Examples: Bug fixes, typo corrections, performance improvements

**Decision tree:**
1. Breaking changes? → Bump MAJOR
2. New features? → Bump MINOR
3. Only fixes? → Bump PATCH

---

### When to Create a Release

Release when you have:
- One or more completed features ready for users
- Critical bug fixes that need deployment
- Multiple small improvements accumulated
- Security fixes (release immediately)

**Don't release:**
- Incomplete features
- Untested changes
- Breaking changes without proper communication

---

### Version Release Process

When the user requests a new version release, follow this **atomic workflow**:

#### Phase 1: Preparation

1. **Ensure clean working directory**
   ```bash
   git status  # Must be clean or only have unreleased changes staged
   ```

2. **Ensure all tests pass**
   ```bash
   npm test && npm run lint
   ```

3. **Analyze changes since last release**
   ```bash
   git log --oneline $(git describe --tags --abbrev=0)..HEAD
   ```

   Review commits to determine version bump (MAJOR/MINOR/PATCH)

4. **Determine new version**
   - Current version: Read from `package.json` (e.g., `0.1.0`)
   - Decide bump type based on changes
   - Calculate new version (e.g., `0.2.0` for minor bump)

#### Phase 2: Release Branch

5. **Create release branch**
   ```bash
   git checkout -b release/v<NEW_VERSION>
   # Example: git checkout -b release/v0.2.0
   ```

6. **Make atomic commits for each change (if needed)**

   If there are uncommitted changes, commit them **atomically** using guito:
   ```bash
   # For each logical change:
   git add <files-for-feature-A>
   guito c <card-id> <shortcodes> "<descriptive message>"

   # Example:
   git add src/commands/new-feature.ts tests/commands/new-feature.test.ts
   guito c 456 f "add new feature X"
   ```

   **Important:** Each commit should be:
   - Self-contained (one logical change)
   - Well-described (clear commit message)
   - Tested (tests included if applicable)

#### Phase 3: Version Bump & Changelog

7. **Update package.json version**
   ```bash
   # Edit package.json manually or use npm version (without git tag)
   npm version <NEW_VERSION> --no-git-tag-version
   # Example: npm version 0.2.0 --no-git-tag-version
   ```

8. **Generate patch notes / changelog**

   Create a comprehensive list of changes for this release:
   ```bash
   # Review all commits since last tag
   git log --oneline $(git describe --tags --abbrev=0)..HEAD
   ```

   **Format patch notes as:**
   ```
   # v0.2.0 - 2026-02-13

   ## 🎉 New Features
   - [TASK-123] Add support for optional environment variables
   - [TASK-456] New `guito find` command for searching commits

   ## 🐛 Bug Fixes
   - [TASK-789] Fix template cleanup for empty patterns

   ## 🔧 Improvements
   - Add loading spinners to all Git operations
   - Improve init wizard feedback UX

   ## 📦 Builds
   - All tests passing (69/69)
   - TypeScript strict mode compliant
   - SEA binary: Node.js >= 25.5.0 required
   ```

9. **Commit version bump with patch notes**

   Use guito to create the version commit with **full patch notes**:
   ```bash
   git add package.json package-lock.json

   # Commit with patch notes in the message body
   guito c <card-id> c "bump version to v0.2.0

   # v0.2.0 - 2026-02-13

   ## 🎉 New Features
   - [TASK-123] Add support for optional environment variables
   - [TASK-456] New \`guito find\` command for searching commits

   ## 🐛 Bug Fixes
   - [TASK-789] Fix template cleanup for empty patterns

   ## 🔧 Improvements
   - Add loading spinners to all Git operations
   - Improve init wizard feedback UX
   "
   ```

   **Why include patch notes in commit?**
   - Easy to reference later when creating GitHub Release
   - Can copy-paste directly from `git log` or `git show`
   - Keeps release notes versioned in git history

#### Phase 4: Build & Tag

10. **Build all artifacts**
    ```bash
    npm run build:deb  # Builds everything: npm package, SEA binary, .deb
    ```

    **Verify builds:**
    - `dist/cli.mjs` exists (ESM for npm)
    - `dist/cli-sea.cjs` exists (CJS for SEA)
    - `build/guito` exists (SEA binary)
    - `build/preguito_<version>_amd64.deb` exists (Debian package)

11. **Create git tag**
    ```bash
    git tag -a v<NEW_VERSION> -m "Release v<NEW_VERSION>"
    # Example: git tag -a v0.2.0 -m "Release v0.2.0"
    ```

#### Phase 5: Merge & Publish

12. **Merge release branch to master**
    ```bash
    git checkout master
    git merge release/v<NEW_VERSION> --no-ff
    # Example: git merge release/v0.2.0 --no-ff
    ```

13. **Push to remote with tags**
    ```bash
    git push origin master
    git push origin --tags
    ```

14. **Publish to npm** (MANUAL - no CI/CD automation)
    ```bash
    npm publish
    ```

    **Important:**
    - The `prepublishOnly` hook will automatically run `npm run build`
    - Only `dist/` folder is published (configured in `package.json` → `files`)
    - npm registry URL: https://www.npmjs.com/package/preguito

    **Verification:**
    - Check npm registry: `npm view preguito version`
    - Should show new version within minutes

15. **Create GitHub Release with .deb**

    Go to: https://github.com/<your-org>/preguito/releases/new

    - **Tag:** Select `v<NEW_VERSION>`
    - **Release title:** `v<NEW_VERSION>`
    - **Description:** Copy patch notes from version commit (step 9)
    - **Attach binary:** Upload `/build/preguito_<version>_amd64.deb`
    - Click "Publish release"

16. **Clean up**
    ```bash
    # Delete local release branch
    git branch -d release/v<NEW_VERSION>

    # Delete remote release branch (if pushed)
    git push origin --delete release/v<NEW_VERSION>

    # Clean build artifacts
    rm -rf build/
    ```

---

### Publishing Channels

Preguito is distributed through **3 channels**:

#### 1. npm Registry (Primary)
- **URL:** https://www.npmjs.com/package/preguito
- **Installation:** `npm install -g preguito`
- **Artifacts:** ESM bundle (`dist/cli.mjs`)
- **Target:** Node.js >= 20.0.0 users
- **Publishing:** Manual via `npm publish` (no CI/CD)

#### 2. GitHub Releases (Secondary)
- **URL:** https://github.com/<org>/preguito/releases
- **Installation:** Download `.deb` and install via `dpkg`
- **Artifacts:** Debian package (`.deb`)
- **Target:** Debian/Ubuntu users who prefer system packages
- **Publishing:** Manual upload to GitHub Releases page

#### 3. Standalone Binary (Optional)
- **Location:** `/build/guito` (not distributed currently)
- **Size:** ~80MB+ (Node.js runtime bundled)
- **Requirements:** Node.js >= 25.5.0 to build SEA
- **Use case:** Air-gapped systems, no Node.js installed
- **Future:** Could be added to GitHub Releases if needed

---

### Troubleshooting Releases

#### Build fails with SEA errors
**Error:** `node: bad option: --experimental-sea-config`

**Cause:** Node.js version < 25.5.0 (SEA requires 25.5+)

**Fix:**
```bash
node --version  # Check version
# Upgrade to Node.js >= 25.5.0 if needed
nvm install 25.6.0
nvm use 25.6.0
```

#### npm publish fails with "need to login"
**Error:** `npm ERR! need to login`

**Fix:**
```bash
npm login
# Enter credentials for npm registry
npm publish
```

#### Version mismatch between package.json and .deb
**Cause:** Manual edit to `debian/control` instead of using automated script

**Fix:**
- **Don't edit** `debian/control` version manually
- The `build-deb.sh` script automatically extracts version from `package.json`
- Always update only `package.json`, then run `npm run build:deb`

#### Forgot to include patch notes in version commit
**Fix:**
```bash
# Amend the commit to add patch notes
git commit --amend
# Edit message to include patch notes, save and exit

# Update the tag
git tag -f v<VERSION> -m "Release v<VERSION>"

# Force push (if already pushed)
git push origin master --force-with-lease
git push origin --tags --force
```

#### Accidentally published wrong version to npm
**Error:** Published v0.2.0 but should be v1.0.0

**Fix:**
```bash
# Unpublish wrong version (within 72 hours)
npm unpublish preguito@0.2.0

# Fix package.json, rebuild, republish
npm version 1.0.0 --no-git-tag-version
npm run build
npm publish
```

**Note:** npm unpublish only works within 72 hours and if no other packages depend on it.

---

### Quick Reference: Version Bump Examples

| Scenario | Current | New | Type | Example Changes |
|----------|---------|-----|------|-----------------|
| Breaking change | 0.1.0 | 1.0.0 | MAJOR | Remove `guito init` command |
| New feature | 0.1.0 | 0.2.0 | MINOR | Add `guito find` command |
| Bug fix | 0.1.0 | 0.1.1 | PATCH | Fix template cleanup regex |
| Multiple features | 0.2.3 | 0.3.0 | MINOR | Add 3 new commands |
| Security fix | 0.2.3 | 0.2.4 | PATCH | Fix command injection |
| Breaking + features | 1.2.3 | 2.0.0 | MAJOR | MAJOR takes precedence |

---

### Release Checklist

Use this checklist when creating a release:

- [ ] All tests passing (`npm test`)
- [ ] Type check passing (`npm run lint`)
- [ ] Clean git status (or changes staged)
- [ ] Analyzed commits since last release
- [ ] Determined correct version bump (MAJOR/MINOR/PATCH)
- [ ] Created release branch (`release/v<VERSION>`)
- [ ] Made atomic commits for unreleased changes (if any)
- [ ] Updated `package.json` version
- [ ] Generated comprehensive patch notes
- [ ] Committed version bump with patch notes
- [ ] Built all artifacts (`npm run build:deb`)
- [ ] Verified artifacts exist in `build/` and `dist/`
- [ ] Created git tag (`git tag -a v<VERSION>`)
- [ ] Merged release branch to master
- [ ] Pushed master and tags to remote
- [ ] Published to npm (`npm publish`)
- [ ] Created GitHub Release with .deb attached
- [ ] Cleaned up release branch and build artifacts
- [ ] Verified npm registry shows new version
- [ ] Verified GitHub Release is live

## Troubleshooting

### Common Issues

**Tests failing after Node.js upgrade:**
- Check Node.js version: `node --version` (must be >= 20)
- Clear node_modules: `rm -rf node_modules && npm install`

**Build errors with tsdown:**
- Clean build: `rm -rf dist && npm run build`
- Check TypeScript errors: `npm run lint`

**CLI not working after changes:**
- Rebuild: `npm run build`
- Relink: `npm unlink -g && npm link`

## Resources

- [Commander.js Docs](https://github.com/tj/commander.js)
- [Vitest Docs](https://vitest.dev/)
- [tsdown Docs](https://tsdown.org/)
- [Node.js SEA Docs](https://nodejs.org/api/single-executable-applications.html)

## Notes for Claude

- This is an active TypeScript CLI project
- Users may test commands frequently—ensure CLI behavior is correct
- Template parsing is core functionality—be extra careful with changes
- The tool is meant to be "lazy"—keep UX simple and fast
- When in doubt about Git operations, ask before executing destructive commands