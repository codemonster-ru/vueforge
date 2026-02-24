# Message

## Purpose

Provide a compatibility alias for inline status messaging using the same behavior core as `Alert`.

## Props

- `modelValue?: boolean` (optional v-model)
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `false`)
- `icon?: string`

## Events

- `update:modelValue`
- `close`

## Slots

- `default` - message content (fallbacks to `message`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)
- `close` (optional)

## Examples

```vue
<Message severity="info" title="Draft mode">
    Changes are saved locally until you publish.
</Message>
```

## Guidance vs Alert

- `Alert` is the canonical component for new implementation.
- `Message` exists for migration compatibility and API familiarity.
- Behavior and tokens are shared with `Alert`; prefer `Alert` in new code/docs.

## Theming

- Override via `theme.overrides.components.message` (same token shape as `alert`).

## Tokens

- Uses `AlertTokens` contract (`gap`, `padding`, `border*`, `backgroundColor`, severity variants, close/action tokens).

## Accessibility

- Inherits `role="alert"` semantics from `Alert`.
- Keep severity and message text concise for assistive announcements.

## Responsive

- Same responsive behavior as `Alert`; keep content short in narrow layouts.

## SSR/Hydration

- Deterministic from props; no client-only rendering branches.

## Testing

- Cover alias wiring (render parity, slot passthrough, close event forwarding).
