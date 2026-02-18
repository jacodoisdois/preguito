# 🔧 guito — Command Reference

Quick shortcuts for everyday git workflows. Each command is designed to be short, memorable, and do the right thing by default.

## Table of Contents

- [Commits](#-commits)
- [Amend & Undo](#-amend--undo)
- [Push](#-push)
- [Branches](#-branches)
- [Rebase](#-rebase)
- [Inspect](#-inspect)
- [Config](#%EF%B8%8F-config)
- [Template System](#-template-system)

---

## 📝 Commits

| Command | Description | Docs |
|---------|-------------|------|
| `guito c [id] [codes] "msg"` | Templated commit with auto-stage | [commit.md](commands/commit.md) |
| `guito cf <hash>` | Create a fixup commit | [fixup.md](commands/fixup.md) |

```bash
guito c 42 fp "add login endpoint" -p
# → Committing: [PAYMENTS-42] feat(prd): add login endpoint
# ✔ Committed.
# ⠋ Pushing...
# ✔ Pushed.

guito cf abc123 -f   # fixup + force push
```

---

## ↩️ Amend & Undo

| Command | Description | Docs |
|---------|-------------|------|
| `guito ap` | Amend + force push | [amend-push.md](commands/amend-push.md) |
| `guito apl` | Amend + force push with lease | [amend-push.md](commands/amend-push.md) |
| `guito u [count]` | Undo last commit (soft reset) | [undo.md](commands/undo.md) |

```bash
guito apl            # amend + safe force push
guito u 3            # undo last 3 commits, keep changes staged
```

---

## 🚀 Push

| Command | Description | Docs |
|---------|-------------|------|
| `guito p` | Simple push (git push) | [push.md](commands/push.md) |
| `guito pu` | Push with --set-upstream | [push.md](commands/push.md) |

```bash
guito p              # simple push
guito pu             # push + set upstream for current branch
```

---

## 🌿 Branches

| Command | Description | Docs |
|---------|-------------|------|
| `guito sw <branch>` | Switch branch (`-n` to create) | [switch.md](commands/switch.md) |
| `guito st` | Stash changes | [stash.md](commands/stash.md) |
| `guito stp` | Pop latest stash | [stash.md](commands/stash.md) |

```bash
guito sw -n feature/login   # create + switch
guito st                    # stash
guito stp                   # pop
```

---

## 🔀 Rebase

| Command | Description | Docs |
|---------|-------------|------|
| `guito r <branch>` | Quick rebase on branch | [rebase.md](commands/rebase.md) |
| `guito re <hash>` | Edit rebase at commit | [rebase.md](commands/rebase.md) |
| `guito ri <count>` | Interactive rebase last N commits | [rebase.md](commands/rebase.md) |

```bash
guito r main         # checkout main, pull, come back, rebase
guito ri 3           # interactive rebase last 3 commits
guito re abc123      # edit rebase at specific commit
```

---

## 🔍 Inspect

| Command | Description | Docs |
|---------|-------------|------|
| `guito s` | Short status | [status.md](commands/status.md) |
| `guito l [count]` | Compact log | [log.md](commands/log.md) |
| `guito f <keyword>` | Search commits by message | [find.md](commands/find.md) |
| `guito t <tag>` | Commits since/from a tag | [find.md](commands/find.md) |

```bash
guito s              # short status
guito l 20           # last 20 commits
guito f "login"      # search commits
guito t v1.0.0       # commits since tag
```

---

## ⚙️ Config

| Command | Description | Docs |
|---------|-------------|------|
| `guito i` | Setup wizard | [init.md](commands/init.md) |
| `guito cfg` | View configuration | [config.md](commands/config.md) |

```bash
guito i              # interactive setup
guito i --default    # use default config
guito cfg            # view current config
guito cfg --path     # show config file path
```

---

## 📖 Template System

Learn how `{{variables}}`, `<placeholders>`, and shortcodes work in [template-system.md](template-system.md).
