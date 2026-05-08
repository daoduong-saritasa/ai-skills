# Architecture Rules

## Layered Architecture

Maintain strict separation between three layers. Never skip or cross layers.

- **UI/View Layer**: Components, directives, pipes, forms — handles user interaction only. No business logic, no direct API calls.
- **Domain/Business Layer**: Services, domain models (TypeScript types), utility functions — no UI knowledge, no DB/API knowledge.
- **Repository/DTO Layer**: API clients, DTOs (Zod schemas), mappers — encapsulates all data access.

## DTOs

- Define DTOs with Zod schemas.
- Infer TypeScript types with `z.infer<typeof schema>`.
- Never use raw API response shapes in the UI layer.

## Domain Models

- Use TypeScript `type` with `readonly` properties.
- Business logic lives in pure utility functions, not components.

## Mappers

- Transform DTOs ↔ Domain Models using a mapper pattern.
- Use `secureParse` (safe Zod parse that logs but does not throw) to validate DTOs before mapping.
- Keep all mapping logic centralized in mapper files.

## Mocking

- Mock data in the repository/business layer only (e.g., services with `of()` + `delay()`).
- Never mock data inside UI components.
