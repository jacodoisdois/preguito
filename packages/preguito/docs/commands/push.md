# `guito p` / `guito push` + `guito pu`

> Push current branch to remote.

## `guito p` / `guito push`

Simple push — just `git push`.

```bash
guito p
# ⠋ Pushing...
# ✔ Pushed.
```

### What it does

```bash
git push
```

### When to use

When your branch already tracks a remote and you just want to push.

---

## `guito pu`

Push and set upstream tracking — for first-time pushes of new branches.

```bash
guito pu
# ⠋ Pushing with --set-upstream origin feature/login...
# ✔ Pushed.
```

### What it does

```bash
git push --set-upstream origin <current-branch>
```

Automatically detects your current branch name — no need to type it.

### When to use

When you've just created a new branch and want to push it for the first time. Instead of typing `git push --set-upstream origin my-long-branch-name`, just `guito pu`.

## See Also

- [commit](commit.md) — commit with `-p` flag to push inline
- [amend-push](amend-push.md) — amend and force push
