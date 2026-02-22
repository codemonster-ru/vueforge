# Link

## Purpose

- Provide unified internal/external link abstraction with shared styling and semantics.
- Reduce inconsistency between router links and anchor tags.

## Props

- `to?: string | object`
- `href?: string`
- `url?: string`
- `as?: 'a' | 'router-link'`
- `type?: string`
- `label?: string`
- `active?: boolean`
- `disabled?: boolean`

## Events

- `click`
- `active`
- `update:active`
- `onActive`

## Slots

- `default`

## Examples

```vue
<Link href="https://example.com" target="_blank">External</Link>
<Link to="/settings">Router link</Link>
<Link href="https://example.com" disabled>Disabled external</Link>
```

## External vs Internal Usage

- External links:
    - Use `href` (or `url`) for anchor mode.
    - Add `target="_blank"` with `rel="noopener noreferrer"` when opening a new tab.
- Internal links:
    - Use `to` for router navigation (`router-link` mode).
    - Prefer named routes or stable app paths.
- Disabled links:
    - Apply `disabled` for both anchor and router-link modes.
    - Disabled anchors remove `href`, set `aria-disabled="true"`, and remove tab focus.

## Theming

- Override via `theme.overrides.components.link`.

## Tokens

Override via `theme.overrides.components.link`:

- `hoverColor`, `activeColor`

## Recipes

- External docs link: `href` + `target="_blank"` + `rel="noopener noreferrer"`.
- In-app navigation: `to="/route"` with router-link mode and active classes from router state.
- Non-interactive label style: `disabled` for unavailable paths.

## Responsive

- Verify truncation/wrap behavior in tight layouts (tables, cards, nav bars).
- Ensure hit area remains usable on touch devices.

## SSR/Hydration

- Server markup must match selected rendering mode (anchor vs router link wrapper).
- Confirm no hydration mismatch when destination props are computed.

## Testing

- Cover internal/external rendering, disabled/active styling, and accessibility attributes.
- Test keyboard activation and proper rel/target security defaults.

## Accessibility

- Disabled links set `aria-disabled`, remove keyboard tab focus (`tabindex=-1`), and block Enter/Space activation.
- Focus-visible state is styled for keyboard navigation consistency.
- Router links expose active state via classes (`vf-link_active`, `vf-link_partially-active`).
- Prefer clear link text for screen-reader readability.
