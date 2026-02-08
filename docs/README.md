# guito — Command Reference

Quick shortcuts for everyday git workflows. Each command is designed to be short, memorable, and do the right thing by default.

## Commits

| Command | Description | Docs |
|---------|-------------|------|
| `guito c -m "msg"` | Templated commit with auto-stage | [commit.md](commands/commit.md) |
| `guito cf <hash>` | Create a fixup commit | [fixup.md](commands/fixup.md) |

## Amend & Undo

| Command | Description | Docs |
|---------|-------------|------|
| `guito ap` | Amend + force push | [amend-push.md](commands/amend-push.md) |
| `guito apl` | Amend + force push with lease | [amend-push.md](commands/amend-push.md) |
| `guito u` | Undo last commit (soft reset) | [undo.md](commands/undo.md) |

## Push

| Command | Description | Docs |
|---------|-------------|------|
| `guito pu` | Push with --set-upstream | [push.md](commands/push.md) |

## Branches

| Command | Description | Docs |
|---------|-------------|------|
| `guito sw <branch>` | Switch branch (`-n` to create) | [switch.md](commands/switch.md) |
| `guito st` | Stash changes | [stash.md](commands/stash.md) |
| `guito stp` | Pop latest stash | [stash.md](commands/stash.md) |

## Rebase

| Command | Description | Docs |
|---------|-------------|------|
| `guito r <branch>` | Quick rebase on branch | [rebase.md](commands/rebase.md) |
| `guito re <hash>` | Edit rebase at commit | [rebase.md](commands/rebase.md) |
| `guito ri <count>` | Interactive rebase last N commits | [rebase.md](commands/rebase.md) |

## Inspect

| Command | Description | Docs |
|---------|-------------|------|
| `guito s` | Short status | [status.md](commands/status.md) |
| `guito l [count]` | Compact log | [log.md](commands/log.md) |
| `guito f <keyword>` | Search commits by message | [find.md](commands/find.md) |
| `guito t <tag>` | Commits since/from a tag | [find.md](commands/find.md) |

## Config

| Command | Description | Docs |
|---------|-------------|------|
| `guito i` | Setup wizard | [init.md](commands/init.md) |
| `guito cfg` | View configuration | [config.md](commands/config.md) |

## Template System

Learn how `{{variables}}` and `<placeholders>` work in [template-system.md](template-system.md).
