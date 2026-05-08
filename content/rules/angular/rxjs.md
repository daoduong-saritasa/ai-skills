# Angular RxJS Rules

## Services Use Observables

- Services own async operations and streaming state via RxJS observables.
- Components consume observables via `toSignal()` or `async` pipe — they do not manage subscriptions directly.

## Subscription Management

- Never subscribe inside another subscribe — use higher-order operators: `switchMap`, `mergeMap`, `concatMap`, `exhaustMap`.
- Always unsubscribe to prevent memory leaks. Prefer `toSignal()` (automatic cleanup) or `takeUntilDestroyed()`.
- Use `finalize()` to reset loading state regardless of success or error.

## Operator Choice

| Use case | Operator |
|---|---|
| Cancel previous on new emission | `switchMap` |
| Allow concurrent | `mergeMap` |
| Queue sequentially | `concatMap` |
| Ignore new while active | `exhaustMap` |

## Error Handling

- Use `catchError` in the pipeline; do not let errors propagate unhandled.
- Expose errors as observable state (e.g., `BehaviorSubject<string | null>`), not thrown exceptions.

## Mock Data

- Mock with `of(data).pipe(delay(ms))` in services during development.
- Remove or gate mocks before production.

## References

- Service with observable state example: `references/rxjs.md`
