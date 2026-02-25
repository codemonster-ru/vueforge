# InlineMessage

## Purpose

Show field-local status/info/error text near controls, separate from global page-level alerts.

## Props

- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `icon?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `role?: 'auto' | 'status' | 'alert' | 'none'` (default `auto`)
- `ariaLive?: 'auto' | 'off' | 'polite' | 'assertive'` (default `auto`)

## Events

- N/A

## Slots

- `default` (message content)
- `title`
- `icon`

## Examples

```vue
<InlineMessage severity="warn" title="Billing email">
    This address is unverified. Invoices may fail to deliver.
</InlineMessage>
```

## Theming

- Override via `theme.overrides.components.inlineMessage`.

## Tokens

- `gap`, `paddingX`, `paddingY`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`
- `iconColor`, `iconSize`
- `fontSize`, `lineHeight`
- `bodyGap`, `titleFontSize`, `titleFontWeight`
- `info.*`, `success.*`, `warn.*`, `danger.*`
- `small.*`, `large.*`

## Recipes

- Place under inputs/selects for validation hints and correction guidance.
- Use `severity="info"` for helper guidance and `severity="danger"` for validation errors.

## Accessibility

- Default `role`/`aria-live` are automatic:
    - `warn`/`danger` -> `alert` + `assertive`
    - `neutral`/`info`/`success` -> `status` + `polite`
- Override with `role`/`ariaLive` when announcement behavior must be customized.

## Responsive

- Inline layout keeps compact footprint and works inside dense form rows and narrow side panels.

## SSR/Hydration

- Deterministic rendering from props and slots; no client-only branch logic.

## Testing

- Cover severity styles, announcement semantics, size variants, and slot/icon rendering.
