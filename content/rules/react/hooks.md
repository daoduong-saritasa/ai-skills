# React Hooks Rules

## Custom Hooks

- Extract reusable stateful logic into custom hooks (prefix with `use`).
- Keeps the UI layer clean; hooks are independently testable.

## Rules of Hooks

- Never call hooks inside conditionals, loops, or nested functions.
- Always call hooks at the top level of a React function component or custom hook.

## Cleanup

- Always return cleanup functions from `useEffect` when subscribing to events, timers, or observables.

## Dependencies

- Keep dependency arrays accurate — do not suppress exhaustive-deps lint warnings without justification.

## References

- Custom hook example with business logic separation: `references/react/hooks.md`
