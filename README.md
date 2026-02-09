# 🦥 preguito

> A lazy git CLI with commit templates and shortcuts.

Typing the same commit prefix, squad name, and ticket number over and over is tedious. preguito lets you define a commit template once and reuse it on every commit — single-letter shortcodes replace verbose flags, so you only type what matters.

- 🔤 **Single-letter shortcodes** — `f` for feat, `x` for fix, `p` for prd
- 📝 **Template-based commits** — define once, reuse forever
- ⚡ **Git shortcuts** — commit, push, rebase, stash, undo in 2-3 chars
- 📁 **Per-project config** — `.preguitorc` in your repo for team conventions
- 📦 **One dependency** — just [Commander.js](https://github.com/tj/commander.js), nothing else
- 🖥️ **Standalone binary** — works without Node.js via SEA

---

## Table of Contents

- [Quick Demo](#-quick-demo)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Cheat Sheet](#-cheat-sheet)
- [Template System](#-template-system)
- [Commands](#-commands)
- [Common Workflows](#-common-workflows)
- [Configuration](#%EF%B8%8F-configuration)
- [Programmatic API](#-programmatic-api)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎬 Quick Demo

**Without preguito:**

```bash
git add -A && git commit -m "[PAYMENTS-42] feat(prd): add login endpoint" && git push
```

**With preguito:**

```bash
guito c 42 fp "add login endpoint" -p
# → Committing: [PAYMENTS-42] feat(prd): add login endpoint
# ✔ Committed.
# ⠋ Pushing...
# ✔ Pushed.
```

`42` is the card ID, `f` = feat, `p` = prd — everything else comes from your config.

---

## 📦 Installation

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

---

## 🚀 Getting Started

### 1. Run the setup wizard

```bash
guito i
```

The wizard walks you through picking features, shortcodes, and creating your config:

```
✨ Welcome to preguito setup!

📋 Choose which features to enable:

  🎫 Include card/ticket ID in commits? (y/n): y
  🏷️  Include commit type (feat, fix, chore...)? (y/n): y
  🌍 Include environment (prd, uat, dev...)? (y/n): y

🔤 Project prefix/sigla (e.g. PROJ): PAYMENTS

─────────────────────────────────────
✅ Setup complete!

  📄 Config saved to /home/you/.config/preguito/config.json
  📝 Template: [PAYMENTS-{{card_id}}] {{type}}({{environment}}): <message>

  🔑 Your shortcodes:
     Types: f=feat, x=fix, c=chore, t=test, r=refactor, d=docs
     Envs:  p=prd, u=uat, d=dev, s=stg, l=local
─────────────────────────────────────
```

Or skip the wizard and use the default template:

```bash
guito i --default
# ✅ Config written to ~/.config/preguito/config.json
# Template: {{type}}: <message> (type defaults to feat)
```

### 2. Make your first commit

```bash
guito c 42 f "add login endpoint"
# → Committing: [PAYMENTS-42] feat: add login endpoint
# ✔ Committed.
```

With environment shortcode:

```bash
guito c 42 fp "add login endpoint"
# f = feat, p = prd
# → Committing: [PAYMENTS-42] feat(prd): add login endpoint
# ✔ Committed.
```

Commit and push in one go:

```bash
guito c 42 f "add login endpoint" -p
# → Committing: [PAYMENTS-42] feat: add login endpoint
# ✔ Committed.
# ⠋ Pushing...
# ✔ Pushed.
```

Preview without committing:

```bash
guito c 42 f "test message" -d
# [PAYMENTS-42] feat: test message
```

---

## 📋 Cheat Sheet

### Commits

```bash
guito c 42 f "message"         # Templated commit
guito c 42 fp "message"        # With type + environment
guito c 42 f "message" -p      # Commit + push
guito c 42 f "message" -f      # Commit + force push (lease)
guito c 42 f "message" -d      # Dry run (preview only)
guito c 42 f "message" -S      # Skip auto-staging
```

### Fixup

```bash
guito cf abc123                 # Fixup commit for abc123
guito cf abc123 -f              # Fixup + force push (lease)
```

### Amend & Undo

```bash
guito ap                        # Amend + force push
guito apl                       # Amend + force push (lease)
guito u                         # Undo last commit (soft reset)
guito u 3                       # Undo last 3 commits
```

### Branches & Stash

```bash
guito sw main                   # Switch branch
guito sw -n feature/login       # Create + switch
guito st                        # Stash changes
guito stp                       # Stash pop
```

### Rebase

```bash
guito r main                    # Quick rebase on main
guito ri 3                      # Interactive rebase last 3
guito re abc123                 # Edit rebase at commit
```

### Push

```bash
guito p                         # Simple push (git push)
guito pu                        # Push + set upstream
```

### Inspect

```bash
guito s                         # Short status
guito l                         # Last 10 commits
guito l 20                      # Last 20 commits
guito f "login"                 # Search commits by message
guito t v1.0.0                  # Commits since tag
guito t v1.0.0 -a               # All commits reachable from tag
```

### Config

```bash
guito i                         # Setup wizard
guito i --default               # Use default config
guito cfg                       # View current config
guito cfg --path                # Show config file path
guito cfg --template            # Show template only
```

---

## 🔤 Template System

Templates use `{{variable}}` for named parameters and `<placeholder>` for the commit message body.

```
[{{prefix}}-{{card_id}}] {{type}}({{environment}}): <message>
```

Variables are resolved from **shortcodes** first, then **config defaults**:

```bash
guito c 42 fp "add login"
# 42        → card_id
# f         → type = feat
# p         → environment = prd
# "add..."  → message
# → [PAYMENTS-42] feat(prd): add login
```

Shortcodes are single letters you define during `guito i` setup:

| Letter | Type | Letter | Environment |
|--------|------|--------|-------------|
| `f` | feat | `p` | prd |
| `x` | fix | `u` | uat |
| `c` | chore | `d` | dev |
| `t` | test | `s` | stg |
| `r` | refactor | `l` | local |
| `d` | docs | | |

See [template-system.md](docs/template-system.md) for full syntax, resolution order, and more examples.

---

## 🔧 Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `guito c [id] [codes] "msg"` | `commit` | Templated commit with auto-stage |
| `guito cf <hash>` | — | Create a fixup commit |
| `guito ap` | — | Amend + force push |
| `guito apl` | — | Amend + force push with lease |
| `guito u [count]` | `undo` | Undo last N commits (soft reset) |
| `guito p` | `push` | Simple push (git push) |
| `guito pu` | — | Push with --set-upstream |
| `guito r <branch>` | `rebase` | Quick rebase on branch |
| `guito re <hash>` | — | Edit rebase at commit |
| `guito ri <count>` | — | Interactive rebase last N commits |
| `guito sw <branch>` | `switch` | Switch/create branch (`-n` to create) |
| `guito st` | — | Stash changes |
| `guito stp` | — | Pop latest stash |
| `guito s` | `status` | Short status |
| `guito l [count]` | `log` | Compact log (default: 10) |
| `guito f <keyword>` | `find` | Search commits by message |
| `guito t <tag>` | `tag` | Commits since/from a tag |
| `guito i` | `init` | Setup wizard |
| `guito cfg` | `config` | View configuration |

See the [full command reference](docs/README.md) for detailed usage, flags, and examples.

---

## 🔄 Common Workflows

### Start a new feature

```bash
guito sw -n feature/login       # Create branch
# ... make changes ...
guito c 42 f "add login" -p     # Commit + push
```

### Quick fix on current branch

```bash
# ... fix the bug ...
guito c 99 x "fix timeout" -p   # x = fix, push immediately
```

### Oops, need to change the last commit

```bash
# ... make more changes ...
guito apl                        # Amend + force push (safe)
```

### Rebase before opening a PR

```bash
guito r main                     # Pull main, rebase on top
guito pu                         # Push with upstream
```

### Clean up commit history

```bash
guito ri 5                       # Interactive rebase last 5 commits
# or create fixup commits:
guito cf abc123 -f               # Fixup + force push
```

---

## ⚙️ Configuration

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

### Per-Project Config

Place a `.preguitorc` or `.preguitorc.json` at your project root to share a commit convention with your team:

```json
{
  "template": "[CHECKOUT-{{card_id}}] {{type}}: <message>",
  "features": { "cardId": true, "type": true, "environment": false },
  "types": [
    { "key": "f", "label": "feat" },
    { "key": "x", "label": "fix" },
    { "key": "c", "label": "chore" }
  ],
  "environments": [],
  "defaults": { "prefix": "CHECKOUT" }
}
```

The global config at `~/.config/preguito/config.json` serves as your personal fallback.

---

## 📚 Programmatic API

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

const msg = renderTemplate(
  "[{{squad}}] {{type}}: <message>",
  { squad: "TEAM", type: "fix" },
  "resolve timeout"
);
// "[TEAM] fix: resolve timeout"
```

---

## ❓ FAQ

**Can I use preguito without running `guito i` first?**
Yes. Without a config, preguito uses the built-in default template `{{type}}: <message>` with `type=feat`. Just run `guito c f "your message"`.

**Can my team share a config?**
Yes. Place a `.preguitorc` or `.preguitorc.json` in your project root and commit it. Everyone on the team will use the same template and shortcodes.

**Does it work without Node.js?**
Yes. Download the standalone `.deb` binary from GitHub Releases — it bundles everything via Node.js SEA.

**What if I need different templates per project?**
Project-local config (`.preguitorc` in repo root) takes priority over global config. Each repo can have its own template, types, and environments.

**Can I customize the shortcode letters?**
Yes. During `guito i` setup, you can reassign any letter to any type or environment. Run `guito i` again to reconfigure.

---

## 🤝 Contributing

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

---

## 📄 License

MIT
