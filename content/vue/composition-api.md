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

- In Vue < 3.5, never destructure props directly — it loses reactivity.
- Use `toRef(props, 'propName')` or `toRefs(props)` when you need a reactive prop reference.

> **Vue 3.5+**: Destructuring `defineProps` preserves reactivity via compiler transform. `const { title } = defineProps<...>()` is safe.

## References

- Props, emits, defineModel, and reactivity examples: `references/composition-api.md`

---

# Vue Composition API Examples

## Props & Emits

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

## Two-Way Binding with defineModel

```vue
<script setup lang="ts">
const model = defineModel<string>()
const countModel = defineModel<number>('count', { default: 0 })
</script>
```

## Props Reactivity

```ts
const props = defineProps<{ title: string }>()

// ❌ Vue < 3.5: destructuring loses reactivity
const { title } = props

// ✅ Preserves reactivity (all versions)
const titleRef = toRef(props, 'title')
```

> **Vue 3.5+**: Destructuring `defineProps` preserves reactivity via compiler transform — `const { title } = defineProps<...>()` is safe.