# Angular Routing Rules

## Route Structure

- Keep route definitions in a dedicated route config, not scattered across components.
- Use lazy-loaded route segments for feature areas.
- Keep route paths stable and descriptive.

## Navigation

- Prefer `routerLink` over imperative navigation when rendering links.
- Use `Router` navigation in event handlers and services only when user interaction requires it.
- Preserve query params and fragment state when navigating between related views.

## Guards & Resolvers

- Use guards for access control, not for fetching ordinary page data.
- Use resolvers only when the route should not render until essential data is available.
- Keep guards and resolvers small and focused.

## Route Components

- Keep route components thin.
- Delegate data access to services and state logic to signals or observables.

## References

- Lazy route and navigation example: `references/routing.md`

---

# Angular Routing Examples

## Lazy-Loaded Route Config

```typescript
import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
  },
]
```

## Declarative Navigation

```html
<a routerLink="/users" [queryParams]="{ tab: 'active' }">Active users</a>
```

## Imperative Navigation

```typescript
import { Router } from '@angular/router'
import { inject } from '@angular/core'

const router = inject(Router)
router.navigate(['/users', userId], { queryParams: { tab: 'activity' } })
```
