# Vue Composables Examples

## Accept Reactive Input with toValue()

```ts
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useFetch(url: MaybeRefOrGetter<string>) {
  // toValue() handles ref, getter, or plain value
  const resolved = toValue(url)
}

// All three call styles work:
useFetch('/api/users')
useFetch(urlRef)
useFetch(() => `/api/users/${props.id}`)
```

## Return Shape

```ts
export function useUserService() {
  const users = ref<User[]>([])
  const loading = ref(false)

  async function loadUsers() { /* ... */ }

  // ✅ Plain object of refs — destructuring preserves reactivity
  // ✅ readonly — prevents external mutation
  return {
    users: readonly(users),
    loading: readonly(loading),
    loadUsers,
  }
}

// ❌ reactive() — destructuring loses reactivity
export function useBad() {
  return reactive({ users: [], loading: false })
}
```
