# `guito s` / `guito status`

> Show short git status.

## Usage

```bash
guito s
```

## Examples

```bash
guito s
#  M src/cli.ts
# ?? src/commands/push.ts

# When working tree is clean
guito s
# ✨ Nothing to commit, working tree clean.
```

## What it does

```bash
git status --short
```
