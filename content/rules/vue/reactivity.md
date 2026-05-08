# Vue Reactivity Rules

## ref vs shallowRef

- **Prefer `shallowRef`** over `ref` when deep reactivity is not needed — better performance.
- Use `ref` only when nested object mutations must trigger reactivity.

```ts
// ✅ shallowRef — only .value reassignment triggers
const data = shallowRef({ items: [] as string[] })
data.value = { items: ['new'] }  // ✅ triggers

// Use ref when nested mutation is required
const user = ref({ name: 'John', profile: { age: 30 } })
user.value.profile.age = 31  // ✅ triggers (deep)
```

## computed

- Use `computed()` for all derived state — never compute in templates.
- Use writable computed (`{ get, set }`) for two-way derived bindings.

## Watchers

- Use `watch` for explicit side effects triggered by specific sources.
- Use `watchEffect` for effects that auto-track all accessed reactive deps.
- Always clean up async effects with `onWatcherCleanup` (Vue 3.5+).

```ts
watchEffect(async () => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort())
  const res = await fetch(`/api/${id.value}`, { signal: controller.signal })
  data.value = await res.json()
})
```

## Avoid reactive() for Return Values

- Do not return `reactive()` objects from composables — destructuring loses reactivity.
- Return individual `ref`s or a plain object of refs.
