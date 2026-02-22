# Tooltip

## Purpose

Handle layered interactions (dialogs, overlays, contextual actions, and transient notifications) with consistent behavior.
Centralize close policies, focus management, and stack/layer contracts for complex SaaS screens.

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

## Responsive

Verify overlay sizing, placement fallback, and viewport collision handling on mobile/tablet/desktop.
Ensure gesture/touch close interactions and action buttons remain accessible on small screens.

## SSR/Hydration

Render closed/open initial state deterministically and keep portal/container structure hydration-safe.
Initialize positioning/focus logic only after mount to avoid server-client markup drift.

## Testing

Cover open/close triggers, escape/outside click behavior, focus trap/restore, and stacking order.
Add accessibility tests for ARIA roles, labelling, and keyboard navigation in layered UI.

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
