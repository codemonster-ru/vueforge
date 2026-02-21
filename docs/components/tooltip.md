# Tooltip

## Props

- `text?: string`
- `placement?: 'top' | 'bottom' | 'left' | 'right'` (default `top`)
- `disabled?: boolean`
- `arrow?: boolean` (default `false`)
- `showDelay?: number` (default `0`)
- `hideDelay?: number` (default `0`)
- `closeOnEsc?: boolean` (default `true`)

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

## Theming

- Override via `theme.overrides.components.tooltip`.

## Tokens

Component tokens (override via `theme.overrides.components.tooltip`).

## Recipes

- Input helper text on hover/focus for compact forms.
- Icon hint tooltip with `arrow` enabled for precise pointer mapping.
- Delayed tooltip on dense UI (`showDelay` / `hideDelay` tuning).

## Accessibility

- Tooltip content should supplement, not replace, visible label text.
- Ensure trigger remains keyboard-focusable for non-pointer users.
- Use concise helper text to avoid excessive announcement noise.

## Interaction Contract

- Opens on `mouseenter` and `focusin` of trigger.
- Closes on `mouseleave`, `focusout`, and `Escape` (when `closeOnEsc=true`).
- Supports delayed open/close using `showDelay` and `hideDelay`.
- Tooltip is dismissed when content is empty (`text` and `content` slot missing).

## Usage Constraints

- Do not place critical or long-form information only in tooltip content.
- Keep tooltip content non-interactive; for interactive content prefer `Popover`.
- Keep `zIndex` above standard page content and below blocking overlays unless explicitly overridden.
