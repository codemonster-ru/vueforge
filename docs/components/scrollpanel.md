# ScrollPanel

## Purpose

Provide a styled scrollable container for long content blocks and side panels.

## Props

- `height?: string` (default `16rem`)
- `minHeight?: string`
- `maxHeight?: string`
- `alwaysShow?: boolean` (default `false`) - always render scrollbars
- `role?: string` (default `region`)
- `ariaLabel?: string` (default `Scrollable region`)
- `tabIndex?: number` (default `0`)

## Slots

- `default`

## Exposed

- `getViewport(): HTMLElement | null`
- `scrollTo(top: number, behavior?: ScrollBehavior)`

## Example

```vue
<ScrollPanel height="18rem" aria-label="Deployment logs">
    <pre>{{ logs }}</pre>
</ScrollPanel>
```

## Theming

- Override via `theme.overrides.components.scrollpanel`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `contentPadding`, `focusRingColor`
- `scrollbarSize`, `scrollbarTrackColor`, `scrollbarThumbColor`

## Accessibility

- Focusable region with configurable `role` and `aria-label`.

## Testing

- Cover role/aria rendering and viewport sizing behavior.
