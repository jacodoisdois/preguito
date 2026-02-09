# `guito i` / `guito init`

> Interactive setup wizard to create your preguito config.

## Usage

```bash
guito i [flags]
```

## Flags

| Flag | Description |
|------|-------------|
| `--default` | Skip prompts, use the default template |

## Examples

```bash
# Interactive wizard
guito i
# ✨ Welcome to preguito setup!
#
# Define your commit template.
# Use {{variable}} for named parameters and <message> for the commit message body.
# Example: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>
#
# Template: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>
#
# Variables found: squad, card_id, type, scope
# Message placeholder: <message>
#
# Set default values (press Enter to skip):
#   squad: PAYMENTS
#   card_id:
#   type: feat
#   scope: api
#
# ✔ Config written to /home/you/.config/preguito/config.json
#   Edit it anytime or run 'guito cfg' to view it.

# Skip wizard, use default template
guito init --default
# ✔ Config written to /home/you/.config/preguito/config.json
```

## What it creates

A JSON config file at `~/.config/preguito/config.json`:

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

See [template-system.md](../template-system.md) for how templates work.

## See Also

- [config](config.md) — view your current configuration
- [Template System](../template-system.md) — how templates and shortcodes work
