# `guito u` / `guito undo`

> Undo the last N commits. Changes stay staged — nothing is lost.

## Usage

```bash
guito u [count]
```

## Examples

```bash
# Undo the last commit
guito u
# → Undoing last 1 commit(s)...
# ✔ Undid last 1 commit(s). Changes are staged.
# M  src/cli.ts
# M  src/commands/push.ts

# Undo the last 3 commits
guito u 3
# → Undoing last 3 commit(s)...
# ✔ Undid last 3 commit(s). Changes are staged.
```

## What it does

```bash
git reset --soft HEAD~<count>
git status --short
```

Uses `--soft` so all changes from the undone commits remain staged. You can re-commit them, edit them, or discard them as needed.

## See Also

- [log](log.md) — inspect commit history
- [commit](commit.md) — create a new commit after undoing
