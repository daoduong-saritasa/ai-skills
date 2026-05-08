# Vue Composition API Rules

## Script Setup

- Always use `<script setup lang="ts">` — never Options API.
- Never use `<script setup>` without `lang="ts"`.

## Props & Emits

- Use type-based declarations for `defineProps` and `defineEmits`.
- Use `withDefaults` for default prop values.
- Use named tuple syntax for emits for clarity.

## Two-Way Binding

- Use `defineModel` (Vue 3.4+) for two-way binding instead of manual prop + emit pairs.

## Component Options

- Use `defineOptions` (Vue 3.3+) to set `name` and `inheritAttrs` when needed.

## Generic Components

- Use `<script setup lang="ts" generic="T extends ...">` for generic components.

## Props Reactivity

- Never destructure props directly — it loses reactivity.
- Use `props.value` or `toRef(() => props.value)` to preserve reactivity.

> **Vue 3.5+**: Destructuring `defineProps` preserves reactivity via compiler transform. `const { title } = defineProps<...>()` is safe.

## References

- Props, emits, defineModel, and reactivity examples: `references/composition-api.md`
