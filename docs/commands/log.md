# `guito l` / `guito log`

> Show compact git log (default: last 10 commits).

## Usage

```bash
guito l [count]
```

## Examples

```bash
# Last 10 commits
guito l
# abc1234 feat: add login endpoint
# def5678 fix: resolve timeout
# ...

# Last 20 commits
guito l 20
```

## What it does

```bash
git log --oneline -n <count>
```
