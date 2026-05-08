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
// ❌ Loses reactivity (Vue < 3.5)
const { title } = defineProps<{ title: string }>()

// ✅ Preserves reactivity (all versions)
const titleRef = toRef(() => props.title)
```

> **Vue 3.5+**: Destructuring `defineProps` preserves reactivity via compiler transform — `const { title } = defineProps<...>()` is safe.
