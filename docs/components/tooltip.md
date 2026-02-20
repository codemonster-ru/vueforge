# Tooltip

## Props

- `text?: string`
- `placement?: 'top' | 'bottom' | 'left' | 'right'` (default `top`)
- `disabled?: boolean`
- `arrow?: boolean` (default `false`)

## Events

- No emitted events.

## Slots

- `default` - trigger content
- `content` (optional) - tooltip content (fallbacks to `text`)

## Examples

```vue
<Tooltip text="Helpful hint" arrow>
    <Button label="Hover me" />
</Tooltip>
```

## Tokens

Component tokens (override via `theme.overrides.components.tooltip`).

## Accessibility

- Tooltip content should supplement, not replace, visible label text.
- Ensure trigger remains keyboard-focusable for non-pointer users.
- Use concise helper text to avoid excessive announcement noise.
