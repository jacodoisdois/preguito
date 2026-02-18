# `guito cf`

> Create a fixup commit targeting a specific commit.

## Usage

```bash
guito cf <hash> [flags]
```

## Flags

| Flag | Description |
|------|-------------|
| `-p, --push` | Push after creating the fixup commit |
| `-f, --force` | Push with `--force-with-lease` after creating |

## Examples

```bash
# Create a fixup commit
guito cf abc1234
# → Staging all changes...
# → Creating fixup commit for abc1234...
# ✔ Fixup commit created.

# Create fixup and push
guito cf abc1234 -p
# → Staging all changes...
# → Creating fixup commit for abc1234...
# ✔ Fixup commit created.
# → Pushing...
# ✔ Pushed.
```

## What it does

```bash
git add -A
git commit --fixup <hash>
git push                      # if -p
git push --force-with-lease   # if -f
```

## Tip

After creating fixup commits, squash them with:

```bash
guito ri 5                    # interactive rebase last 5 commits
# or
git rebase -i --autosquash HEAD~5
```

The `--autosquash` flag will automatically reorder and mark fixup commits for squashing.

## See Also

- [commit](commit.md) — create a templated commit
- [rebase](rebase.md) — interactive rebase to squash fixups
