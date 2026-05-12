# React Performance Rules

## Rendering

- Keep render work cheap and predictable.
- Split large components into smaller pieces when only part of the UI changes.
- Avoid deriving state in effects when the value can be computed during render.

## Memoization

- Use `React.memo` only when a component re-renders often with the same props.
- Use `useMemo` for expensive calculations, not for simple expressions.
- Use `useCallback` only when a stable function reference matters.

## Event and State Flow

- Prefer moving interaction logic into event handlers instead of effect chains.
- Use functional `setState` when the next state depends on the previous value.
- Use `startTransition` for non-urgent updates that should not block input.
- Use `useDeferredValue` when expensive UI should lag behind fast input.

## Loading Strategy

- Lazy-load route-level or feature-level code when it is not needed immediately.
- Avoid importing heavy utilities or components into hot paths.
- Keep third-party code out of the critical rendering path when possible.

## References

- Re-render and loading strategy example: `references/performance.md`

---

# React Performance Examples

## Stable Derived State

```tsx
function UserList({ users }: { users: User[] }) {
  const activeUsers = useMemo(() => users.filter((user) => user.active), [users])
  return <UserTable rows={activeUsers} />
}
```

## Non-Urgent Updates

```tsx
const [isPending, startTransition] = useTransition()

function handleFilterChange(nextFilter: string) {
  startTransition(() => {
    setFilter(nextFilter)
  })
}
```

## Deferred Input

```tsx
const deferredQuery = useDeferredValue(query)
const results = useMemo(() => searchItems(items, deferredQuery), [items, deferredQuery])
```
