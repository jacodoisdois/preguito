# `guito r` / `guito re` / `guito ri`

> Rebase shortcuts — quick rebase, edit rebase, and interactive rebase.

## `guito r <branch>` / `guito rebase <branch>`

Quick rebase: checkout target branch, pull, come back, rebase on top.

```bash
guito r main
# → Current branch: feature/login
# → Checking out main...
# → Pulling main...
# → Checking out feature/login...
# → Rebasing feature/login onto main...
# ✔ Rebase complete.
```

Equivalent to:
```bash
git checkout main
git pull
git checkout feature/login
git rebase main
```

## `guito re <hash>`

Start an interactive rebase paused at a specific commit for editing.

```bash
guito re abc1234
# → Starting edit rebase on commit abc1234...
# ✔ Rebase paused at the target commit. Make your changes, then run:
#   git add . && git rebase --continue
```

Equivalent to:
```bash
GIT_SEQUENCE_EDITOR="sed -i 's/^pick abc1234/edit abc1234/'" git rebase -i abc1234^
```

## `guito ri <count>`

Interactive rebase for the last N commits. Opens your editor so you can reorder, squash, edit, or drop commits.

```bash
guito ri 3
# → Starting interactive rebase for the last 3 commit(s)...
# (opens your editor)
```

Equivalent to:
```bash
git rebase -i HEAD~3
```

## See Also

- [fixup](fixup.md) — create fixup commits to squash later
- [undo](undo.md) — undo commits if rebase goes wrong
