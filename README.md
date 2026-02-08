# preguito

A lazy git CLI with commit templates and shortcuts.

## Why

Typing the same commit prefix, squad name, and ticket number over and over is tedious. Teams need consistent commit messages, but enforcing a format manually is error-prone. preguito lets you define a commit template once and reuse it on every commit — variables are filled from defaults or CLI flags, so you only type what matters.

## Quick Demo

**Without preguito:**

```bash
git add -A && git commit -m "[PAYMENTS-42] feat(api): add login endpoint" && git push
```

**With preguito:**

```bash
guito c -m "add login endpoint" -p
# Committing: [PAYMENTS-42] feat(api): add login endpoint
# Pushed.
```

The template fills in `[PAYMENTS-42] feat(api):` automatically from your config defaults. You can override any variable on the fly with `--variable value`.

## Installation

### npm (requires Node.js >= 20)

```bash
npm install -g preguito
```

### Standalone binary (.deb)

Download the `.deb` from [GitHub Releases](https://github.com/jacodoisdois/preguito/releases) and install:

```bash
sudo dpkg -i preguito_0.1.0_amd64.deb
```

No Node.js required — the binary bundles everything via Node.js SEA.

## Getting Started

### 1. Run the setup wizard

```bash
guito init
```

The wizard walks you through creating your config:

```
Welcome to preguito setup!

Define your commit template.
Use {{variable}} for named parameters and <message> for the commit message body.
Example: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>

Template: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>

Variables found: squad, card_id, type, scope
Message placeholder: <message>

Set default values (press Enter to skip):
  squad: PAYMENTS
  card_id:
  type: feat
  scope: api

Config written to /home/you/.config/preguito/config.json
```

Or skip the wizard and use the default template (`{{type}}: <message>`):

```bash
guito init --default
```

### 2. Understand the config

The wizard creates a JSON file like this:

```json
{
  "template": "[{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>",
  "defaults": {
    "squad": "PAYMENTS",
    "type": "feat",
    "scope": "api"
  }
}
```

- `{{variable}}` — named parameters, replaced with values from defaults or CLI flags.
- `<message>` — the commit message body, passed via `-m`.
- `defaults` — values used when you don't pass a flag. Variables without a default must be passed on the CLI.

### 3. Make your first commit

```bash
guito c -m "add login endpoint" --card_id 42
# Committing: [PAYMENTS-42] feat(api): add login endpoint
```

Override any default:

```bash
guito c -m "fix timeout" --type fix --scope core --card_id 99
# Committing: [PAYMENTS-99] fix(core): fix timeout
```

Preview without committing:

```bash
guito c -m "test message" --card_id 10 -d
# [PAYMENTS-10] feat(api): test message
```

## Template System

### Syntax

| Token | Description | Example |
|-------|-------------|---------|
| `{{variable}}` | Named parameter, replaced from defaults or CLI flags | `{{type}}`, `{{squad}}` |
| `<placeholder>` | Commit message body, filled by `-m` | `<message>`, `<desc>` |

A template can have any number of `{{variables}}` and at most one `<placeholder>`.

### Variable Resolution

Variables are resolved in this order (highest priority first):

1. **CLI flags** — `--type fix` overrides the default
2. **Config defaults** — used when no CLI flag is given
3. **Error** — if a variable has neither, preguito tells you what's missing

### Template Examples

**Minimal:**

```
{{type}}: <message>
```

```bash
guito c -m "add login"
# feat: add login
```

**Conventional commits:**

```
{{type}}({{scope}}): <message>
```

```bash
guito c -m "fix timeout" --type fix --scope api
# fix(api): fix timeout
```

**With ticket prefix:**

```
[{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>
```

```bash
guito c -m "add login" --card_id 42
# [PAYMENTS-42] feat(api): add login
```

## Commands

### `guito c` / `guito commit`

Create a commit using your configured template.

| Flag | Description |
|------|-------------|
| `-m, --message <text>` | **(required)** Commit message body |
| `-p, --push` | Push after committing |
| `-f, --force` | Push with `--force-with-lease` after committing |
| `-d, --dry-run` | Print the rendered message without executing |
| `-S, --no-stage` | Skip automatic `git add -A` |
| `--<variable> <value>` | Override any template variable |

By default, `guito c` runs `git add -A` before committing. Use `-S` to skip this and commit only what's already staged.

```bash
guito c -m "add feature"                         # commit with auto-stage
guito c -m "add feature" -p                      # commit + push
guito c -m "quick fix" -f                        # commit + force push (with lease)
guito c -m "test" -d                             # dry run, just print the message
guito c -m "staged only" -S                      # skip git add -A
guito c -m "fix bug" --type fix --scope api      # override defaults
```

### `guito i` / `guito init`

Interactive setup wizard to create your preguito config.

| Flag | Description |
|------|-------------|
| `--default` | Skip prompts, use the default template |

```bash
guito init            # interactive wizard
guito init --default  # use default: {{type}}: <message>
```

### `guito cfg` / `guito config`

View current configuration.

| Flag | Description |
|------|-------------|
| `--path` | Show only the config file path |
| `--template` | Show only the template string |
| `--variables` | Show template variables and their defaults |

```bash
guito cfg              # show everything
guito cfg --path       # just the file path
guito cfg --template   # just the template
guito cfg --variables  # variables and their default values
```

### `guito ap`

Amend the last commit with all current changes and force push (`git push --force`).

```bash
guito ap
# Staging all changes...
# Amending last commit...
# Pushing (--force)...
```

### `guito apl`

Amend the last commit with all current changes and force push with lease (`git push --force-with-lease`). Safer than `ap`.

```bash
guito apl
# Staging all changes...
# Amending last commit...
# Pushing (--force-with-lease)...
```

### `guito r <branch>` / `guito rebase <branch>`

Quick rebase: checks out the target branch, pulls latest, checks out your branch, rebases on top.

```bash
guito r main
# Current branch: feature/login
# Checking out main...
# Pulling main...
# Checking out feature/login...
# Rebasing feature/login onto main...
# Rebase complete.
```

Equivalent to:

```bash
git checkout main
git pull
git checkout feature/login
git rebase main
```

### `guito re <hash>`

Start an interactive rebase paused at the specified commit for editing.

```bash
guito re abc1234
# Starting edit rebase on commit abc1234...
# Rebase paused at the target commit. Make your changes, then run:
#   git add . && git rebase --continue
```

### `guito ri <count>`

Interactive rebase for the last N commits. Opens your editor so you can reorder, squash, edit, or drop commits.

```bash
guito ri 3
# Starting interactive rebase for the last 3 commit(s)...
# (opens your editor)
```

### `guito pu`

Push current branch and set upstream tracking. Useful when pushing a new branch for the first time.

```bash
guito pu
# Pushing with --set-upstream origin feature/login...
# Pushed.
```

### `guito cf <hash>`

Create a fixup commit targeting a specific commit. Stages all changes automatically. Use with `git rebase --autosquash` later to squash it into the target.

| Flag | Description |
|------|-------------|
| `-p, --push` | Push after creating the fixup commit |
| `-f, --force` | Push with `--force-with-lease` after creating |

```bash
guito cf abc1234            # create fixup commit
guito cf abc1234 -p         # create fixup + push
guito cf abc1234 -f         # create fixup + force push (with lease)
```

### `guito u [count]` / `guito undo [count]`

Undo the last N commits with a soft reset. All changes remain staged so nothing is lost.

```bash
guito u              # undo last commit
guito u 3            # undo last 3 commits
# Undid last 3 commit(s). Changes are staged.
```

### `guito s` / `guito status`

Show short git status.

```bash
guito s
#  M src/cli.ts
# ?? src/commands/push.ts
```

### `guito sw <branch>` / `guito switch <branch>`

Switch branches, or create a new one with `-n`.

| Flag | Description |
|------|-------------|
| `-n, --new` | Create a new branch |

```bash
guito sw main              # switch to main
guito sw -n feature/login  # create and switch to new branch
```

### `guito st`

Stash all current changes.

```bash
guito st
# Saved working directory and index state WIP on main: ...
```

### `guito stp`

Pop the latest stash.

```bash
guito stp
# On branch main: ...
```

### `guito l [count]` / `guito log [count]`

Show compact git log (default: last 10 commits).

```bash
guito l            # last 10 commits
guito l 20         # last 20 commits
```

### `guito f <keyword>` / `guito find <keyword>`

Search commits by message keyword across all branches.

| Flag | Description |
|------|-------------|
| `-n, --number <count>` | Limit number of results |

```bash
guito f "login"            # find all commits mentioning "login"
guito f "fix" -n 5         # find last 5 commits mentioning "fix"
```

### `guito t <tag>` / `guito tag <tag>`

Show commits related to a tag. By default shows commits since the tag until HEAD. Use `--all` to show all commits reachable from the tag.

| Flag | Description |
|------|-------------|
| `-a, --all` | Show all commits reachable from the tag |

```bash
guito t v1.0.0             # commits since v1.0.0 until HEAD
guito t v1.0.0 --all       # all commits reachable from v1.0.0
```

## Configuration

### Config File Locations

preguito searches for config files in this order:

1. `.preguitorc` (project root)
2. `.preguitorc.json` (project root)
3. `~/.preguitorc`
4. `~/.preguitorc.json`
5. `~/.config/preguito/config.json`
6. Built-in default: `{{type}}: <message>` with `type=feat`

Project-local configs take priority, so different repos can use different templates.

### Config Schema

```json
{
  "template": "[{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>",
  "defaults": {
    "squad": "PAYMENTS",
    "type": "feat",
    "scope": "api"
  }
}
```

- `template` **(required)** — your commit message template string.
- `defaults` *(optional)* — default values for template variables. All values must be strings.

### Per-Project Config

Place a `.preguitorc` or `.preguitorc.json` at your project root to share a commit convention with your team. This file can be committed to the repo.

```json
// .preguitorc.json
{
  "template": "[{{squad}}-{{card_id}}] {{type}}: <message>",
  "defaults": {
    "squad": "CHECKOUT",
    "type": "feat"
  }
}
```

The global config at `~/.config/preguito/config.json` serves as your personal fallback.

## Programmatic API

preguito exports its core functions for use in other tools:

```typescript
import {
  parseTemplate,
  renderTemplate,
  mergeContext,
  loadConfig,
  loadConfigOrDefault,
  writeConfig,
} from "preguito";

const parsed = parseTemplate("[{{squad}}] {{type}}: <message>");
// { variables: ["squad", "type"], messagePlaceholder: "message" }

const context = mergeContext({ type: "feat" }, { type: "fix" });
// { type: "fix" }

const msg = renderTemplate("[{{squad}}] {{type}}: <message>", { squad: "TEAM", type: "fix" }, "resolve timeout");
// "[TEAM] fix: resolve timeout"
```

## Contributing

```bash
git clone https://github.com/jacodoisdois/preguito.git
cd preguito
npm install
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Watch mode (tsdown) |
| `npm test` | Run tests (vitest) |
| `npm run lint` | Type check (tsc --noEmit) |
| `npm run build` | Production build |
| `npm run build:sea` | Build standalone binary (Node.js SEA) |
| `npm run build:deb` | Build .deb package |

**Tech stack:** TypeScript, Commander.js, tsdown (Rolldown-based bundler), Vitest.

## License

MIT
