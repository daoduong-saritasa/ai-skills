# Performance Rules

## Core Web Vitals Targets

Optimize for these from the start of every project:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Loading Strategy

- Implement lazy loading and code splitting for all heavy routes/features.
- Never eagerly load modules that are not needed on initial render.
- Use `defer` / `async` for non-critical scripts.

## Assets

- Optimize all images (compress, correct format, explicit `width`/`height`).
- Use semantic CSS custom properties for theming: `--primary-color`, `--accent-color`, `--tertiary-color`.
- Avoid unnecessary re-renders; measure before optimizing.
