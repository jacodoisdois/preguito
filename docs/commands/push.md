# `guito pu`

> Push current branch and set upstream tracking.

## Usage

```bash
guito pu
```

## Examples

```bash
# First push of a new branch
guito pu
# → Pushing with --set-upstream origin feature/login...
# ✔ Pushed.
```

## What it does

```bash
git push --set-upstream origin <current-branch>
```

Automatically detects your current branch name — no need to type it.

## When to use

When you've just created a new branch and want to push it for the first time. Instead of typing `git push --set-upstream origin my-long-branch-name`, just `guito pu`.
