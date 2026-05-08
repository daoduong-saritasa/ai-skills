# React Component Rules

## Function Placement

- Define helper functions **outside** the component if they do not use hooks or component state.
  - Benefits: independently testable, no memoization needed, clearer separation.

## Event Handlers

- Use **named** event handlers, not inline arrow functions in JSX.
- Wrap in `useCallback` only when the function is passed to a memoized child component.

## Template Complexity

- Extract complex rendering logic into named `const` values or `useMemo` above the JSX return.
- Keep JSX clean — no ternary chains or embedded logic blocks.

## Props & Callbacks

- Use **object parameters** for props and callbacks that take more than one argument.
- Avoids positional ambiguity and makes future additions non-breaking.

## Memoization

- Use `React.memo` for components that render frequently with the same props.
- Use `useMemo` for expensive computations.
- Use `useCallback` for functions passed to memoized child components.
- Do not over-memoize — only apply when there is a measurable benefit.

## References

- Event handler and component examples: `references/react/components.md`
