# Button

## Purpose

- Execute primary and secondary actions with consistent visual hierarchy and interaction semantics.
- Support both command buttons and link-like navigation actions.

## Props

- `to?: string | object`
- `href?: string`
- `url?: string`
- `as?: 'button' | 'link'`
- `icon?: string`
- `type?: 'button' | 'submit' | 'reset' | string` (default `button`)
- `size?: 'small' | 'normal' | 'large'`
- `label?: string`
- `loading?: boolean` (default `false`)
- `rounded?: boolean` (default `false`)
- `iconPos?: 'top' | 'right' | 'bottom' | 'left'` (default `left`)
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: string` (default `primary`)
- `disabled?: boolean` (default `false`)

## Events

- Native `click` from rendered button/link

## Slots

- `default`

## Examples

```vue
<Button label="Primary" />
<Button label="Outlined" variant="outlined" />
<Button label="Docs" to="/docs" as="link" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Override via `theme.overrides.components.button`.

## Recipes

- Primary action: filled primary button for main page action.
- Secondary action: outlined or text variant for non-destructive alternatives.
- Navigation action: `to`/`href` usage for route and external link actions.

## Responsive

- Validate size/icon/label combinations at mobile/tablet/desktop touch targets.
- Ensure loading and long-label states do not break button group layouts.

## SSR/Hydration

- Rendered element type (button or link) must match server and client output.
- Loading/disabled controlled states should hydrate deterministically.

## Testing

- Cover click behavior, loading/disabled guards, polymorphic render modes, and icon positions.
- Add accessibility tests for keyboard activation and focus visibility.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
