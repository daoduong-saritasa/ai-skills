# Performance Examples

## Code Splitting

```tsx
// ✅ React — route-level lazy loading
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

```ts
// ✅ Angular — lazy-loaded standalone component
{
  path: 'dashboard',
  loadComponent: () =>
    import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
}
```

```ts
// ✅ Vue — async component
const Dashboard = defineAsyncComponent(() => import('./pages/Dashboard.vue'))
```
