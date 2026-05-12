# @daoduong-saritasa/fe-skills

AI skills platform for frontend projects. Gives your whole team a shared set of coding standards that each developer loads into their own AI tool.

## How it works

Run `generate` → prompts for framework + AI provider → writes one skill folder for your AI tool, containing all relevant rules and examples.

## Usage

```bash
npx @daoduong-saritasa/fe-skills@latest
# or explicitly:
npx @daoduong-saritasa/fe-skills@latest generate
```

Prompts for:
1. Framework (Angular / React / Vue / None)
2. AI provider

Then generates **one skill folder** for your chosen AI provider:

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
    └── ...
```

`SKILL.md` is a lightweight index — tells the AI which file covers which topic so it loads only what's relevant. Full rules and examples live in `references/`.

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
| `angular/routing` | Lazy routes, navigation, guards, resolvers |
| `react/components` | Function placement, memoization, naming |
| `react/hooks` | Custom hooks, cleanup, dependency arrays |
| `react/performance` | Re-renders, memoization, transitions, deferred input |
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
node /path/to/ai-skills-cli/dist/index.js generate
```

