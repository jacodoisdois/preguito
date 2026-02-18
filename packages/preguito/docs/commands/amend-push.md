# `guito ap` / `guito apl`

> Amend the last commit and force push in one step.

## Usage

```bash
guito ap     # amend + force push
guito apl    # amend + force push with lease (safer)
```

## Examples

```bash
# Quick amend after fixing a typo
guito ap
# → Staging all changes...
# → Amending last commit...
# ✔ Amended.
# → Pushing (--force)...
# ✔ Pushed.

# Safer version with --force-with-lease
guito apl
# → Staging all changes...
# → Amending last commit...
# ✔ Amended.
# → Pushing (--force-with-lease)...
# ✔ Pushed.
```

## What it does

**`guito ap`:**
```bash
git add -A
git commit --amend --no-edit
git push --force
```

**`guito apl`:**
```bash
git add -A
git commit --amend --no-edit
git push --force-with-lease
```

## When to use

- `ap` — when you're the only one working on the branch and want speed
- `apl` — when others might have pushed to the same branch (prevents overwriting their work)

## See Also

- [commit](commit.md) — create a templated commit
- [push](push.md) — push with upstream tracking
