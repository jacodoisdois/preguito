# Template System

preguito uses a simple template syntax to generate commit messages. Define your template once, and every `guito c` fills in the blanks.

## Table of Contents

- [Syntax](#syntax)
- [Variable Resolution](#variable-resolution)
- [Shortcodes](#shortcodes)
- [Examples](#examples)
- [Config File](#config-file)
- [Config Search Order](#config-search-order)
- [Tips](#tips)

## Syntax

| Token | Description | Example |
|-------|-------------|---------|
| `{{variable}}` | Named parameter, replaced from shortcodes or config defaults | `{{type}}`, `{{card_id}}` |
| `<placeholder>` | Commit message body, passed as the last positional argument(s) | `<message>`, `<desc>` |

A template can have any number of `{{variables}}` and at most one `<placeholder>`.

## Variable Resolution

Variables are resolved in this order (highest priority first):

1. **Shortcodes** — single-letter codes parsed from the positional arguments (`f` = feat, `p` = prd)
2. **Config defaults** — used when no shortcode provides the value
3. **Error** — if a variable has neither, preguito tells you what's missing

## Shortcodes

Instead of typing full variable values, preguito uses single-letter shortcodes for types and environments. You define them during `guito i` setup.

Default shortcodes:

| Letter | Type | Letter | Environment |
|--------|------|--------|-------------|
| `f` | feat | `p` | prd |
| `x` | fix | `u` | uat |
| `c` | chore | `d` | dev |
| `t` | test | `s` | stg |
| `r` | refactor | `l` | local |
| `d` | docs | | |

Combine shortcodes in a single argument:

```bash
guito c 42 fp "add login"
# f = feat (type), p = prd (environment)
# → [PAYMENTS-42] feat(prd): add login
```

Only one type and one environment per commit. Letters are customizable during setup.

## Examples

### Minimal template

```
{{type}}: <message>
```

```bash
guito c f "add login"
# → Committing: feat: add login
# ✔ Committed.
```

### With ticket prefix

```
[{{prefix}}-{{card_id}}] {{type}}: <message>
```

```bash
guito c 42 f "add login"
# → Committing: [PAYMENTS-42] feat: add login
# ✔ Committed.
```

### With environment

```
[{{prefix}}-{{card_id}}] {{type}}({{environment}}): <message>
```

```bash
guito c 42 fp "add login"
# → Committing: [PAYMENTS-42] feat(prd): add login
# ✔ Committed.

guito c 42 xu "fix timeout"
# → Committing: [PAYMENTS-42] fix(uat): fix timeout
# ✔ Committed.
```

### Dry run — preview without committing

```bash
guito c 42 f "test message" -d
# [PAYMENTS-42] feat: test message
```

### Missing variable

```bash
guito c "add login"
# ✖ Missing shortcodes argument. Provide type/environment shortcodes.
```

## Config File

Templates are stored in your config file:

```json
{
  "template": "[PAYMENTS-{{card_id}}] {{type}}({{environment}}): <message>",
  "features": {
    "cardId": true,
    "type": true,
    "environment": true
  },
  "types": [
    { "key": "f", "label": "feat" },
    { "key": "x", "label": "fix" }
  ],
  "environments": [
    { "key": "p", "label": "prd" },
    { "key": "u", "label": "uat" }
  ],
  "defaults": {
    "prefix": "PAYMENTS"
  }
}
```

Run `guito i` to create your config interactively, or `guito cfg` to view it.

## Config Search Order

1. `.preguitorc` (project root)
2. `.preguitorc.json` (project root)
3. `~/.preguitorc`
4. `~/.preguitorc.json`
5. `~/.config/preguito/config.json`
6. Built-in default: `{{type}}: <message>` with `type=feat`

Project-local configs take priority, so different repos can use different templates.

## Tips

- **Test your template** with dry-run: `guito c 42 f "test" -d`
- **Customize shortcode letters** during `guito i` setup — reassign any letter
- **Share templates** by placing `.preguitorc` in your repo root and committing it
- **View your config** anytime with `guito cfg`
- **Reset your config** by running `guito i` again — it will overwrite the existing config

## See Also

- [Command Reference](README.md) — all commands at a glance
- [commit](commands/commit.md) — the `guito c` command in detail
- [init](commands/init.md) — the setup wizard
