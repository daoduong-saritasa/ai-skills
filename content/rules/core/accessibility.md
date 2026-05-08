# Accessibility Rules

Follow **WCAG 2.1 AA** on every project.

## Semantic HTML

- Use semantic elements: `<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`.
- Use `<button>` for interactive actions, `<a>` for navigation only.
- Never use a `<div>` or `<span>` as a clickable element.

## Forms

- Every form control must have an associated `<label>` (not a placeholder used as label).
- Add `title` attribute on controls/links that have no descriptive text.

## Reusable Components

- Avoid `id` attributes in reusable components (use classes instead).

## Keyboard & Screen Reader

- Ensure all interactive elements are reachable and operable by keyboard.
- Test with screen readers; use ARIA attributes only when semantic HTML is insufficient.
