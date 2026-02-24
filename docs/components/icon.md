# Icon

## Purpose

Provide a single, theme-aware icon wrapper over the official VueForge icon provider (`@codemonster-ru/vueiconify`).

## Props

- `icon?: string` (default `''`)
- `size?: string | number`
- `color?: string`
- `spin?: boolean` (default `false`)
- `decorative?: boolean` (default `false`)
- `ariaLabel?: string` (default `Icon`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- No emitted events.

## Slots

- No named slots.

## Examples

```vue
<Icon icon="check" aria-label="Success" />
```

```vue
<Icon icon="circleNotch" spin decorative />
```

## Theming

- Override via `theme.overrides.components.icon`.

## Tokens

- `size`, `color`, `spinDuration`

## Tree-Shaking Strategy

- VueForge does not bundle icon glyph packs; install `@codemonster-ru/vueiconify` as peer dependency in the app.
- Keep icon usage static at call sites (`<Icon icon="check" />`) to let bundlers optimize icon-package imports.
- Avoid creating a global runtime registry of all icons in app bootstrap code.

## Accessibility

- For meaningful icons, keep `decorative=false` and provide a specific `ariaLabel`.
- For visual-only icons, set `decorative=true` to expose `aria-hidden`.

## Responsive

- Use token or prop-based sizing (`size`) and verify icon alignment in dense mobile toolbars.

## SSR/Hydration

- SSR output is deterministic (simple inline wrapper + glyph component render).
- No client-only lifecycle hooks are required.

## Testing

- Cover semantic vs decorative accessibility attributes.
- Cover size/color overrides and spin behavior.
