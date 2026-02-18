# `guito c` / `guito commit`

> Create a commit using your configured template.

## Usage

```bash
guito c [card_id] [shortcodes] <message...> [flags]
```

Arguments are positional — no `--variable` flags needed:

1. **card_id** *(if enabled)* — your ticket/card number
2. **shortcodes** *(if types/envs enabled)* — single-letter codes for type and environment (e.g. `f` = feat, `xp` = fix + prd)
3. **message** — the commit message body (everything after shortcodes)

## Flags

| Flag | Description |
|------|-------------|
| `-p, --push` | Push after committing |
| `-f, --force` | Push with `--force-with-lease` after committing |
| `-d, --dry-run` | Print the rendered message without executing |
| `-S, --no-stage` | Skip automatic `git add -A` |

## Examples

```bash
# Simple commit (auto-stages everything)
guito c 42 f "add login endpoint"
# → Committing: [PAYMENTS-42] feat: add login endpoint
# ✔ Committed.

# Commit and push
guito c 42 f "add login endpoint" -p
# → Committing: [PAYMENTS-42] feat: add login endpoint
# ✔ Committed.
# ⠋ Pushing...
# ✔ Pushed.

# Type + environment shortcodes combined
guito c 42 fp "add login endpoint"
# f = feat, p = prd
# → Committing: [PAYMENTS-42] feat(prd): add login endpoint
# ✔ Committed.

# Different type
guito c 99 x "fix timeout"
# x = fix
# → Committing: [PAYMENTS-99] fix: fix timeout
# ✔ Committed.

# Dry run — preview without committing
guito c 10 f "test message" -d
# [PAYMENTS-10] feat: test message

# Skip auto-staging, commit only what's already staged
guito c 42 f "staged only" -S

# Without card ID (if not enabled in config)
guito c f "add login endpoint"
# → Committing: feat: add login endpoint
```

## What it does

```bash
git add -A                    # unless -S
git commit -m "<rendered>"    # template + shortcodes + message
git push                      # if -p
git push --force-with-lease   # if -f
```

Template variables are resolved from shortcodes and config defaults. See [template-system.md](../template-system.md) for details.

## See Also

- [Template System](../template-system.md) — how templates and shortcodes work
- [fixup](fixup.md) — create a fixup commit
- [amend-push](amend-push.md) — amend last commit and push
