# React Component Rules

## Function Placement

- Define helper functions **outside** the component if they do not use hooks or component state.
  - Benefits: independently testable, no memoization needed, clearer separation.

## Event Handlers

- Use **named** event handlers, not inline arrow functions in JSX.
- Wrap in `useCallback` only when the function is passed to a memoized child component.

```tsx
// ✅ Named handler
const handleRowClick = useCallback((params: { row: Row; index: number }) => {
  onRowClick?.(params);
}, [onRowClick]);

// ❌ Inline handler
<button onClick={() => onRowClick?.({ row, index })}>
```

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

## Example: Component with Extracted Logic

```tsx
// ✅ Pure helper outside component scope
function filterVisibleRows(rows: DataRow[]): DataRow[] {
  return rows.filter(r => r.isVisible);
}

export const DataTable = memo<DataTableProps>(({ data, onRowClick }) => {
  const visibleRows = useMemo(() => filterVisibleRows(data), [data]);

  const handleRowClick = useCallback(
    (params: { row: DataRow; index: number }) => onRowClick?.(params),
    [onRowClick],
  );

  // handleRowClick passed directly — no inline arrow, no new ref per render
  return (
    <div role="table">
      {visibleRows.map((row, index) => (
        <DataRow key={row.id} row={row} index={index} onRowClick={handleRowClick} />
      ))}
    </div>
  );
});
```
