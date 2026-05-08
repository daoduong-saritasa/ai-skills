# @daoduong-saritasa/fe-skills

AI skills platform for frontend projects. Gives your whole team a shared set of coding standards that each developer loads into their own AI tool.

## How it works

1. **Project lead** runs `init` once → creates `.ai/` with the team's rules & references → **committed to git**
2. Each dev runs `generate` → reads `.ai/` and creates skill files for their AI provider → **gitignored or committed per team preference**

## Commands

### `init` — project setup

```bash
npx @daoduong-saritasa/fe-skills init
```

Prompts for a framework (Angular / React / Vue), then writes:

```
.ai/
  manifest.json          # framework + skill list
  rules/
    core/                # architecture, code-quality, performance, accessibility
    <framework>/         # components, hooks/composables, etc.
  references/
    core/                # code examples for core rules
    <framework>/         # code examples for framework rules
```

Run once per project. Re-running prompts before overwriting.

### `generate` — per-developer

```bash
npx @daoduong-saritasa/fe-skills generate
```

Reads `.ai/` and generates **one skill folder** for your chosen AI provider:

| Provider | Output |
|---|---|
| GitHub Copilot | `.github/skills/<name>/` |
| Cursor | `.cursor/rules/<name>/` |
| Claude Code | `.claude/skills/<name>/` |
| Codex | `.agents/skills/<name>/` |
| Windsurf | `.windsurf/rules/<name>/` |

Each skill follows this structure:

```
<name>/
├── SKILL.md          # metadata + index guiding the AI to the right reference
└── references/
    ├── accessibility.md      # rules + merged code examples
    ├── architecture.md
    ├── secure-parse.md       # cross-referenced helpers
    └── ...
```

`SKILL.md` is a lightweight index — it tells the AI which file covers which topic so it loads only what's relevant. The full rules and examples live in `references/`.

If a skill folder already exists, you'll be asked to replace, rename, or skip before anything is overwritten.

## Included rules

| Module | What it covers |
|---|---|
| `core/architecture` | Layered architecture, DTOs, mappers, secureParse |
| `core/code-quality` | SOLID, naming, API design, tooling |
| `core/performance` | Core Web Vitals, lazy loading, assets |
| `core/accessibility` | WCAG 2.1 AA, semantic HTML, forms, ARIA |
| `angular/components` | Standalone, signals, OnPush, inject() |
| `angular/rxjs` | Services, operators, subscription management |
| `angular/forms` | Typed reactive forms |
| `react/components` | Function placement, memoization, naming |
| `react/hooks` | Custom hooks, cleanup, dependency arrays |
| `vue/composition-api` | script setup, defineProps, defineModel |
| `vue/reactivity` | ref vs shallowRef, computed, watchers |
| `vue/composables` | Naming, toValue(), return shape |

## Development

```bash
pnpm install
pnpm build        # compile TypeScript → dist/
pnpm dev          # watch mode

# Test locally
mkdir /tmp/test-project && cd /tmp/test-project
node /path/to/ai-skills-cli/dist/index.js init
node /path/to/ai-skills-cli/dist/index.js generate
```

