# Vue Reactivity Examples

## shallowRef vs ref

```ts
// ✅ shallowRef — only .value reassignment triggers reactivity
const data = shallowRef({ items: [] as string[] })
data.value = { items: ['new'] }   // ✅ triggers
data.value.items.push('new')      // ❌ does NOT trigger

// Use ref only when nested mutation must trigger reactivity
const user = ref({ name: 'John', profile: { age: 30 } })
user.value.profile.age = 31       // ✅ triggers (deep)
```

## Async Watcher Cleanup

```ts
watchEffect(async () => {
  const controller = new AbortController()
  // ✅ onWatcherCleanup runs before next effect or on unmount (Vue 3.5+)
  onWatcherCleanup(() => controller.abort())
  const res = await fetch(`/api/${id.value}`, { signal: controller.signal })
  data.value = await res.json()
})
```
