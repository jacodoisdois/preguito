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

### Release Process

1. Update version in `package.json`
2. Run full test suite: `npm test`
3. Build all artifacts: `npm run build && npm run build:sea && npm run build:deb`
4. Generate changelog (consider using changelog-generator skill)
5. Tag release: `git tag v<version>`
6. Push with tags: `git push --tags`

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