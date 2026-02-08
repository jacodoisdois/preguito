# `guito f` / `guito find` + `guito t` / `guito tag`

> Search commits by keyword or explore commits around a tag.

## `guito f <keyword>` / `guito find <keyword>`

Search commits by message keyword across all branches.

### Flags

| Flag | Description |
|------|-------------|
| `-n, --number <count>` | Limit number of results |

### Examples

```bash
# Find all commits mentioning "login"
guito f "login"
# abc1234 feat: add login endpoint
# def5678 fix: login timeout

# Limit to last 5 matches
guito f "fix" -n 5
```

### What it does

```bash
git log --oneline --all --grep=<keyword>
git log --oneline --all --grep=<keyword> -n <count>   # with -n
```

---

## `guito t <tag>` / `guito tag <tag>`

Show commits related to a tag.

### Flags

| Flag | Description |
|------|-------------|
| `-a, --all` | Show all commits reachable from the tag |

### Examples

```bash
# Commits since a tag until HEAD (what changed since the release)
guito t v1.0.0
# Commits since v1.0.0:
# abc1234 feat: new feature
# def5678 fix: bug fix

# All commits reachable from a tag (everything in that release)
guito t v1.0.0 --all
# Commits reachable from v1.0.0:
# abc1234 feat: new feature
# ...
```

### What it does

```bash
git log --oneline v1.0.0..HEAD    # default
git log --oneline v1.0.0          # with --all
```
