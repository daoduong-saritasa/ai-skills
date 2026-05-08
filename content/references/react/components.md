# React Component Examples

## Event Handlers

```tsx
// ✅ Named handler — memoized because passed to child
const handleRowClick = useCallback((params: { row: Row; index: number }) => {
  onRowClick?.(params);
}, [onRowClick]);

// ❌ Inline handler — new function ref every render
<button onClick={() => onRowClick?.({ row, index })}>
```

## Component with Extracted Logic

```tsx
// ✅ Pure helper outside component scope — testable, no memoization needed
function filterVisibleRows(rows: DataRow[]): DataRow[] {
  return rows.filter(r => r.isVisible);
}

export const DataTable = memo<DataTableProps>(({ data, onRowClick }) => {
  const visibleRows = useMemo(() => filterVisibleRows(data), [data]);

  const handleRowClick = useCallback(
    (params: { row: DataRow; index: number }) => onRowClick?.(params),
    [onRowClick],
  );

  return (
    <div role="table">
      {visibleRows.map((row, index) => (
        <DataRow key={row.id} row={row} index={index} onRowClick={handleRowClick} />
      ))}
    </div>
  );
});
```
