# @saritasa/fe-skills

AI skills platform for Saritasa frontend projects. Gives your whole team a shared set of coding standards that each developer loads into their own AI tool.

## How it works

1. **Project lead** runs `init` once → creates `.ai/` with the team's skills → **committed to git**
2. **Each dev** runs `generate` → reads `.ai/` and creates files for their AI provider → **also committed, or local**

## Commands

### `init` — project setup

```bash
npx @saritasa/fe-skills init
```

Prompts for a framework (Angular / React / Vue), then writes:

```
.ai/
  manifest.json        # framework + skill list
  rules/
    core/              # architecture, code-quality, performance, accessibility
    angular/           # (or react/ or vue/)
```

Run once per project. Re-running prompts before overwriting.

### `generate` — per-developer

```bash
npx @saritasa/fe-skills generate
```

Reads `.ai/manifest.json` and generates skill files for your chosen AI provider:

| Provider | Output |
|---|---|
| GitHub Copilot | `.github/skills/<name>/SKILL.md` |
| Cursor | `.cursor/rules/<name>.mdc` |
| Claude Code | `.claude/skills/<name>/SKILL.md` |
| Codex | `AGENTS.md` |
| Windsurf | `.windsurf/rules/<name>.md` |

Each skill becomes its own file with a `description` so the AI loads it only when relevant — not all rules on every prompt.

If files already exist, you'll be asked to confirm before anything is overwritten. Custom skills you added manually are left untouched.

## Included skills

| Module | What it covers |
|---|---|
| `core/architecture` | Layered architecture, DTOs, mappers |
| `core/code-quality` | SOLID, naming, API design, tooling |
| `core/performance` | Core Web Vitals, lazy loading, assets |
| `core/accessibility` | WCAG 2.1 AA, semantic HTML, forms |
| `angular/components` | Standalone, signals, OnPush, inject() |
| `angular/rxjs` | Services, operators, subscription management |
| `angular/forms` | Reactive forms |
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
