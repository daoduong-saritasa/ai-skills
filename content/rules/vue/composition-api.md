# Vue Composition API Rules

## Script Setup

- Always use `<script setup lang="ts">` — never Options API.
- Never use `<script setup>` without `lang="ts"`.

## Props & Emits

- Use type-based declarations for `defineProps` and `defineEmits`.
- Use `withDefaults` for default prop values.
- Use named tuple syntax for emits for clarity.

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  count?: number
}>(), { count: 0 })

const emit = defineEmits<{
  update: [value: string]
  close: []
}>()
</script>
```

## Two-Way Binding

- Use `defineModel` (Vue 3.4+) for two-way binding instead of manual prop + emit pairs.

```vue
<script setup lang="ts">
const model = defineModel<string>()
</script>
```

## Component Options

- Use `defineOptions` (Vue 3.3+) to set `name` and `inheritAttrs` when needed.

## Generic Components

- Use `<script setup lang="ts" generic="T extends ...">` for generic components.

## Props Reactivity

- Never destructure props directly — it loses reactivity.
- Use `props.value` or `toRef(() => props.value)` to preserve reactivity.

```ts
// ❌ Loses reactivity
const { title } = defineProps<{ title: string }>()

// ✅ Preserves reactivity
const titleRef = toRef(() => props.title)
```
