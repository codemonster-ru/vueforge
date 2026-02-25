# AppBar

## Purpose

- Provide a shell-level top application bar for global navigation/actions.
- Support fixed/sticky placement with compact (`dense`) mode.

## Props

- `as?: string` (default `header`)
- `title?: string` (default empty)
- `fixed?: boolean` (default `false`)
- `sticky?: boolean` (default `true`; ignored when `fixed=true`)
- `dense?: boolean` (default `false`)
- `mobileBreakpoint?: number` (default `768`)
- `collapseActionsOnMobile?: boolean` (default `true`)
- `height?: string` (optional CSS override)
- `denseHeight?: string` (optional CSS override)
- `zIndex?: string | number` (optional CSS override)
- `ariaLabel?: string` (optional landmark label)
- `actionsAriaLabel?: string` (default `App bar actions`)

## Slots

- `start` (optional): leading controls (menu/back/logo).
- `title` (optional): title area content.
- `default` (optional): additional content in title region.
- `actions` (optional): trailing action controls.

## Example

```vue
<AppBar title="Operations">
    <template #start>
        <button type="button">Menu</button>
    </template>
    <template #actions>
        <button type="button">Invite</button>
        <button type="button">Create</button>
    </template>
</AppBar>
```

## Tokens

Component tokens (override via `theme.overrides.components.appBar`):

- `height`, `denseHeight`
- `padding`, `densePadding`, `mobilePadding`
- `gap`, `actionsGap`
- `borderColor`, `backgroundColor`, `textColor`
- `zIndex`

## Responsive

- `mobileBreakpoint` toggles mobile mode.
- With `collapseActionsOnMobile=true`, action controls wrap into a dedicated mobile row.

## SSR/Hydration

- Initial mobile detection is viewport-based; for strict SSR consistency keep initial placement choice deterministic in app shell composition.

## Testing

- Covers slot rendering, fixed/sticky/dense classes, style overrides, and mobile breakpoint behavior.

## Accessibility

- Prefer semantic `header` usage for shell landmarks.
- Provide `actionsAriaLabel` when action cluster meaning needs explicit narration.
