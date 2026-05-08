# Accessibility Examples

## Labels & Form Controls

```html
<!-- ✅ Label associated with control -->
<label for="email">Email address</label>
<input id="email" type="email" />

<!-- ❌ Placeholder used as label -->
<input type="email" placeholder="Email address" />
```

## Interactive Elements

```html
<!-- ✅ Button for action, anchor for navigation -->
<button type="button" class="save-btn">Save</button>
<a href="/dashboard">Go to Dashboard</a>

<!-- ❌ div/span as clickable element -->
<div onclick="save()">Save</div>
```

## Semantic Structure

```html
<!-- ✅ Semantic landmarks -->
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<article>...</article>

<!-- ✅ Visually-hidden label for icon-only controls -->
<button type="button" aria-label="Close dialog">✕</button>
```
