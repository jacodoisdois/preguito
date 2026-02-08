# preguito

A lazy git CLI with commit templates and shortcuts.

## Why

Typing the same commit prefix, squad name, and ticket number over and over is tedious. Teams need consistent commit messages, but enforcing a format manually is error-prone. preguito lets you define a commit template once and reuse it on every commit — variables are filled from defaults or CLI flags, so you only type what matters.

## Quick Demo

**Without preguito:**

```bash
git add -A && git commit -m "[PAYMENTS-42] feat(api): add login endpoint" && git push
```

**With preguito:**

```bash
guito c -m "add login endpoint" -p
# → Committing: [PAYMENTS-42] feat(api): add login endpoint
# ✔ Committed.
# → Pushing...
# ✔ Pushed.
```

The template fills in `[PAYMENTS-42] feat(api):` automatically from your config defaults. You can override any variable on the fly with `--variable value`.

## Installation

### npm (requires Node.js >= 20)

```bash
npm install -g preguito
```

### Standalone binary (.deb)

Download the `.deb` from [GitHub Releases](https://github.com/jacodoisdois/preguito/releases) and install:

```bash
sudo dpkg -i preguito_0.1.0_amd64.deb
```

No Node.js required — the binary bundles everything via Node.js SEA.

## Getting Started

### 1. Run the setup wizard

```bash
guito init
```

The wizard walks you through creating your config:

```
✨ Welcome to preguito setup!

Define your commit template.
Use {{variable}} for named parameters and <message> for the commit message body.
Example: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>

Template: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>

Variables found: squad, card_id, type, scope
Message placeholder: <message>

Set default values (press Enter to skip):
  squad: PAYMENTS
  card_id:
  type: feat
  scope: api

✔ Config written to /home/you/.config/preguito/config.json
  Edit it anytime or run 'guito cfg' to view it.
```

Or skip the wizard and use the default template (`{{type}}: <message>`):

```bash
guito init --default
```

### 2. Understand the config

The wizard creates a JSON file like this:

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

- `{{variable}}` — named parameters, replaced with values from defaults or CLI flags.
- `<message>` — the commit message body, passed via `-m`.
- `defaults` — values used when you don't pass a flag. Variables without a default must be passed on the CLI.

### 3. Make your first commit

```bash
guito c -m "add login endpoint" --card_id 42
# → Committing: [PAYMENTS-42] feat(api): add login endpoint
# ✔ Committed.
```

Override any default:

```bash
guito c -m "fix timeout" --type fix --scope core --card_id 99
# → Committing: [PAYMENTS-99] fix(core): fix timeout
# ✔ Committed.
```

Preview without committing:

```bash
guito c -m "test message" --card_id 10 -d
# [PAYMENTS-10] feat(api): test message
```

## Template System

Use `{{variable}}` for named parameters and `<placeholder>` for the commit message body. Variables resolve from CLI flags first, then config defaults.

```bash
# Template: [{{squad}}-{{card_id}}] {{type}}({{scope}}): <message>
guito c -m "add login" --card_id 42
# → Committing: [PAYMENTS-42] feat(api): add login
# ✔ Committed.
```

See [template-system.md](docs/template-system.md) for full syntax, resolution order, and more examples.

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `guito c -m "msg"` | `commit` | Templated commit with auto-stage |
| `guito cf <hash>` | — | Create a fixup commit |
| `guito ap` | — | Amend + force push |
| `guito apl` | — | Amend + force push with lease |
| `guito u [count]` | `undo` | Undo last N commits (soft reset) |
| `guito pu` | — | Push with --set-upstream |
| `guito r <branch>` | `rebase` | Quick rebase on branch |
| `guito re <hash>` | — | Edit rebase at commit |
| `guito ri <count>` | — | Interactive rebase last N commits |
| `guito sw <branch>` | `switch` | Switch/create branch |
| `guito st` | — | Stash changes |
| `guito stp` | — | Pop latest stash |
| `guito s` | `status` | Short status |
| `guito l [count]` | `log` | Compact log (default: 10) |
| `guito f <keyword>` | `find` | Search commits by message |
| `guito t <tag>` | `tag` | Commits since/from a tag |
| `guito i` | `init` | Setup wizard |
| `guito cfg` | `config` | View configuration |

See the [full command reference](docs/README.md) for detailed usage, flags, and examples.

## Configuration

### Config File Locations

preguito searches for config files in this order:

1. `.preguitorc` (project root)
2. `.preguitorc.json` (project root)
3. `~/.preguitorc`
4. `~/.preguitorc.json`
5. `~/.config/preguito/config.json`
6. Built-in default: `{{type}}: <message>` with `type=feat`

Project-local configs take priority, so different repos can use different templates.

### Config Schema

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

- `template` **(required)** — your commit message template string.
- `defaults` *(optional)* — default values for template variables. All values must be strings.

### Per-Project Config

Place a `.preguitorc` or `.preguitorc.json` at your project root to share a commit convention with your team. This file can be committed to the repo.

```json
// .preguitorc.json
{
  "template": "[{{squad}}-{{card_id}}] {{type}}: <message>",
  "defaults": {
    "squad": "CHECKOUT",
    "type": "feat"
  }
}
```

The global config at `~/.config/preguito/config.json` serves as your personal fallback.

## Programmatic API

preguito exports its core functions for use in other tools:

```typescript
import {
  parseTemplate,
  renderTemplate,
  mergeContext,
  loadConfig,
  loadConfigOrDefault,
  writeConfig,
} from "preguito";

const parsed = parseTemplate("[{{squad}}] {{type}}: <message>");
// { variables: ["squad", "type"], messagePlaceholder: "message" }

const context = mergeContext({ type: "feat" }, { type: "fix" });
// { type: "fix" }

const msg = renderTemplate("[{{squad}}] {{type}}: <message>", { squad: "TEAM", type: "fix" }, "resolve timeout");
// "[TEAM] fix: resolve timeout"
```

## Contributing

```bash
git clone https://github.com/jacodoisdois/preguito.git
cd preguito
npm install
```

| Script | Description |
|--------|-------------|
| `npm run dev` | Watch mode (tsdown) |
| `npm test` | Run tests (vitest) |
| `npm run lint` | Type check (tsc --noEmit) |
| `npm run build` | Production build |
| `npm run build:sea` | Build standalone binary (Node.js SEA) |
| `npm run build:deb` | Build .deb package |

**Tech stack:** TypeScript, Commander.js, tsdown (Rolldown-based bundler), Vitest.

## License

MIT
