# Template System

preguito uses a simple template syntax to generate commit messages. Define your template once, and every `guito c` fills in the blanks.

## Syntax

| Token | Description | Example |
|-------|-------------|---------|
| `{{variable}}` | Named parameter, replaced from defaults or CLI flags | `{{type}}`, `{{squad}}` |
| `<placeholder>` | Commit message body, filled by `-m` | `<message>`, `<desc>` |

A template can have any number of `{{variables}}` and at most one `<placeholder>`.

## Variable Resolution

Variables are resolved in this order (highest priority first):

1. **CLI flags** — `--type fix` overrides the default
2. **Config defaults** — used when no CLI flag is given
3. **Error** — if a variable has neither, preguito tells you what's missing

## Examples

### Minimal

```
{{type}}: <message>
```

```bash
guito c -m "add login"
# → Committing: feat: add login
# ✔ Committed.
```

### Conventional commits

```
{{type}}({{scope}}): <message>
```

```bash
guito c -m "fix timeout" --type fix --scope api
# → Committing: fix(api): fix timeout
# ✔ Committed.
```

### With ticket prefix

```
[{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>
```

```bash
guito c -m "add login" --card_id 42
# → Committing: [PAYMENTS-42] feat(api): add login
# ✔ Committed.
```

## Config File

Templates are stored in your config file:

```json
{
  "template": "[{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>",
  "defaults": {
    "squad": "PAYMENTS",
    "type": "feat",
    "scope": "api"
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
