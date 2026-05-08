# Code Quality Examples

## Naming (S-I-D)

```ts
// ✅ Descriptive, no context duplication
const handleUserClick = (user: User) => { /* ... */ }
MenuItem.handleClick()

// ❌ Abbreviated / duplicated context
const handleUCk = (u: User) => { /* ... */ }
MenuItem.handleMenuItemClick()
```

## Object Parameters

```ts
// ✅ Object params — safe to extend without breaking callers
function createUser(params: { name: string; email: string; role: Role }): User { /* ... */ }

// ❌ Positional — adding a param breaks every call site
function createUser(name: string, email: string, role: Role): User { /* ... */ }
```
