# `guito sw` / `guito switch`

> Switch branches, or create a new one.

## Usage

```bash
guito sw <branch> [flags]
```

## Flags

| Flag | Description |
|------|-------------|
| `-n, --new` | Create a new branch |

## Examples

```bash
# Switch to an existing branch
guito sw main
# → Switching to main...
# ✔ On branch main.

# Create and switch to a new branch
guito sw -n feature/login
# → Creating and switching to feature/login...
# ✔ On branch feature/login.
```

## What it does

```bash
git checkout <branch>       # without -n
git checkout -b <branch>    # with -n
```

## See Also

- [stash](stash.md) — stash changes before switching branches
