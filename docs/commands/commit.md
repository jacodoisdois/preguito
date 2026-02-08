# `guito c` / `guito commit`

> Create a commit using your configured template.

## Usage

```bash
guito c -m <message> [flags] [--variable value...]
```

## Flags

| Flag | Description |
|------|-------------|
| `-m, --message <text>` | **(required)** Commit message body |
| `-p, --push` | Push after committing |
| `-f, --force` | Push with `--force-with-lease` after committing |
| `-d, --dry-run` | Print the rendered message without executing |
| `-S, --no-stage` | Skip automatic `git add -A` |
| `--<variable> <value>` | Override any template variable |

## Examples

```bash
# Simple commit (auto-stages everything)
guito c -m "add login endpoint"
# → Committing: [PAYMENTS-42] feat(api): add login endpoint
# ✔ Committed.

# Commit and push
guito c -m "add login endpoint" -p
# → Committing: [PAYMENTS-42] feat(api): add login endpoint
# ✔ Committed.
# → Pushing...
# ✔ Pushed.

# Override template variables
guito c -m "fix timeout" --type fix --scope core --card_id 99
# → Committing: [PAYMENTS-99] fix(core): fix timeout
# ✔ Committed.

# Dry run — preview without committing
guito c -m "test message" --card_id 10 -d
# [PAYMENTS-10] feat(api): test message

# Skip auto-staging, commit only what's already staged
guito c -m "staged only" -S
```

## What it does

```bash
git add -A                    # unless -S
git commit -m "<rendered>"    # template + variables + message
git push                      # if -p
git push --force-with-lease   # if -f
```

Template variables are resolved from CLI flags first, then config defaults. See [template-system.md](../template-system.md) for details.
