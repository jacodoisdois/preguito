# `guito cfg` / `guito config`

> View current preguito configuration.

## Usage

```bash
guito cfg [flags]
```

## Flags

| Flag | Description |
|------|-------------|
| `--path` | Show only the config file path |
| `--template` | Show only the template string |
| `--variables` | Show template variables and their defaults |

## Examples

```bash
# Show everything
guito cfg
# Config file: /home/you/.config/preguito/config.json
# Template: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>
# Variables:
#   squad: PAYMENTS
#   card_id: (no default)
#   type: feat
#   scope: api
# Message placeholder: <message> (passed via -m)

# Just the file path
guito cfg --path
# /home/you/.config/preguito/config.json

# Just the template
guito cfg --template
# [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>

# Just the variables
guito cfg --variables
#   squad: PAYMENTS
#   card_id: (no default)
#   type: feat
#   scope: api
```
