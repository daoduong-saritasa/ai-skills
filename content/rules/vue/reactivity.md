# Vue Reactivity Rules

## ref vs shallowRef

- **Prefer `shallowRef`** over `ref` when deep reactivity is not needed — better performance.
- Use `ref` only when nested object mutations must trigger reactivity.

## computed

- Use `computed()` for all derived state — never compute in templates.
- Use writable computed (`{ get, set }`) for two-way derived bindings.

## Watchers

- Use `watch` for explicit side effects triggered by specific sources.
- Use `watchEffect` for effects that auto-track all accessed reactive deps.
- Always clean up async effects with `onWatcherCleanup` (Vue 3.5+).

## Avoid reactive() for Return Values

- Do not return `reactive()` objects from composables — destructuring loses reactivity.
- Return individual `ref`s or a plain object of refs.

## References

- `shallowRef` vs `ref` and watcher cleanup examples: `references/vue/reactivity.md`
