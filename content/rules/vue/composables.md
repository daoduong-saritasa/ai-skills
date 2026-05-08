# Vue Composables Rules

## Naming

- Always prefix composable names with `use`: `useFetch`, `useMouse`, `useCounter`.

## Accept Reactive Input

- Accept `MaybeRefOrGetter<T>` for inputs that may be static or reactive.
- Unwrap with `toValue()` inside the composable.

## Return Shape

- Return plain objects of `ref`s (not `reactive()`).
- Expose state as `readonly` refs to prevent external mutation.

## Responsibility

- Each composable has a single responsibility.
- Keep business logic out of components — delegate to composables and services.
- Mock data in the composable/service layer, never in the component template.

## References

- `toValue()` usage and return shape examples: `references/vue/composables.md`
