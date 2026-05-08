# Angular Forms Rules

- Prefer **Reactive Forms** over Template-driven forms for all non-trivial forms.
- Define form structure in the component class, not the template.
- Use typed forms (`FormControl<T>`, `FormGroup`) for type safety.
- Validate at the form level; keep validation logic out of components.

## References

- Typed reactive form example: `references/forms.md`
