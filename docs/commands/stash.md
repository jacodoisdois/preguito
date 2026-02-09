# `guito st` / `guito stp`

> Stash and unstash changes quickly.

## Usage

```bash
guito st     # stash
guito stp    # stash pop
```

## Examples

```bash
# Save current work
guito st
# Saved working directory and index state WIP on main: abc1234 last commit msg

# Restore saved work
guito stp
# On branch main
# Changes not staged for commit:
#   modified:   src/cli.ts
```

## What it does

**`guito st`:**
```bash
git stash
```

**`guito stp`:**
```bash
git stash pop
```

## See Also

- [switch](switch.md) — switch branches (stash first if needed)
