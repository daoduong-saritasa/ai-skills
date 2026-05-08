# IMapper

Interface for all DTO-to-domain-model transformations. Encapsulates validation and shape mapping.

## Interface

```ts
export interface IMapper<TDto, TDomain> {
  fromDto(dto: unknown): TDomain | null
  toDto?(domain: TDomain): TDto
}
```

## Example

```ts
import { z } from 'zod'
import { secureParse } from './secure-parse'
import type { IMapper } from './mapper.interface'

// DTO schema
const userDtoSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  email: z.string().email(),
})
type UserDto = z.infer<typeof userDtoSchema>

// Domain model
type User = {
  readonly id: number
  readonly firstName: string
  readonly email: string
}

// Mapper implementation
export class UserMapper implements IMapper<UserDto, User> {
  fromDto(dto: unknown): User | null {
    const parsed = secureParse(userDtoSchema, dto)
    if (!parsed) return null
    return {
      id: parsed.id,
      firstName: parsed.first_name,
      email: parsed.email,
    }
  }
}

// Repository usage
const users = rawDtos
  .map(dto => mapper.fromDto(dto))
  .filter((u): u is User => u !== null)
```

## Rules

- Always use `secureParse` (not `schema.parse()`) in `fromDto`.
- Keep all mapping logic in mapper files — never in components or services.
- Return `null` on invalid data; callers filter nulls.
- `toDto` is optional — only implement when writing back to the API.
