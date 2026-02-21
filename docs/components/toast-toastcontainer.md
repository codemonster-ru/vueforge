# Toast / ToastContainer

## Overview

Props (Toast):

- `modelValue?: boolean` (v-model)
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `true`)
- `duration?: number` (ms, default `0`, no auto-close)

Props (ToastContainer):

- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` (default `top-right`)

## Props

- No additional props documented for this component at the moment.

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Examples

```vue
<ToastContainer position="top-right">
    <Toast v-model="toastOpen" title="Saved" message="Changes are saved." severity="success" :duration="2500" />
</ToastContainer>
```

## Recipes

- Success feedback: short-lived save confirmation (`duration` 1500-3000 ms).
- Persistent warning: `duration=0` with close button for user-dismissed alerts.
- Global stack: place a single `ToastContainer` near app root and render toast instances from store.

## Tokens

Component tokens (override via `theme.overrides.components.toast`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `shadow`, `minWidth`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`, `closeSize`
- `containerGap`, `containerPadding`, `containerMaxWidth`, `zIndex`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/borderColor/textColor)

## Accessibility

- Toast uses `role="status"` with `aria-live="polite"` for non-blocking announcements.
- Close control is a native button with accessible label (`Close toast`).
- Keep toasts brief and actionable; avoid long interactive content in toast body.

## Interaction Contract

- `modelValue=true`:
    - emits `open`
    - renders toast content in current container
- Close triggers:
    - close button (when `closable=true`)
    - auto-dismiss timer when `duration > 0`
- On close:
    - emits `update:modelValue=false`
    - emits `close`

## Z-Index Policy

- Toast stack uses `--vf-toast-z-index` (default `120`).
- Default layer intent:
    - above command palette (`110`) and modal/drawer (`100`)
    - below notification center (`125`)
- Keep toast non-blocking; do not use as modal replacement.
