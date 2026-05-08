# secureParse

Safe Zod parsing wrapper. Returns `null` on failure instead of throwing. Validation errors are logged; callers handle the null case.

## Implementation

```ts
import type { ZodSchema } from 'zod'

export function secureParse<T>(schema: ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error('[secureParse] Validation failed:', result.error.issues)
    return null
  }
  return result.data
}
```

## Usage

```ts
const dto = secureParse(userDtoSchema, rawApiResponse)
if (!dto) return  // validation error already logged

processUser(dto)  // ✅ dto is typed as UserDto
```

## Why

- Prevents uncaught exceptions from invalid API shapes.
- Keeps processing running despite partial data failures.
- Centralizes validation error logging.
