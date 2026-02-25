# ResizableSidebar

## Purpose

- Provide sidebar behavior with drag resize, collapse, and persisted width/state.

## Props

- `modelValue?: number` (width in px, default `280`)
- `collapsed?: boolean` (default `false`)
- `minWidth?: number` (default `200`)
- `maxWidth?: number` (default `480`)
- `collapsedWidth?: number` (default `56`)
- `side?: 'left' | 'right'` (default `left`)
- `resizable?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `showToggle?: boolean` (default `true`)
- `persistence?: 'none' | 'local' | 'session'` (default `none`)
- `persistenceKey?: string`
- `ariaLabel?: string` (default `Sidebar`)

## Events

- `update:modelValue`
- `update:collapsed`
- `resize-end`

## Slots

- `header` (optional) - slot props `{ collapsed, toggle, width }`
- `default` - slot props `{ collapsed, width }`
- `footer` (optional) - slot props `{ collapsed, toggle, width }`

## Example

```vue
<ResizableSidebar
    v-model="sidebarWidth"
    v-model:collapsed="sidebarCollapsed"
    persistence="local"
    persistence-key="workspace-sidebar"
>
    <NavigationRail :collapsed="sidebarCollapsed" />
</ResizableSidebar>
```

## Tokens

Component tokens (override via `theme.overrides.components.resizableSidebar`):

- `backgroundColor`, `textColor`, `borderColor`, `disabledOpacity`
- `sectionPadding`, `contentPadding`
- `toggleMargin`, `toggleSize`, `toggleBorderRadius`
- `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `resizerSize`

## Responsive

- Can be paired with `PageLayout`/`SplitLayout` mobile collapse logic.

## SSR/Hydration

- Persistence (`local/session`) is applied client-side only.

## Testing

- Covers collapse events, drag resize behavior, and persisted state restore.

## Accessibility

- Resize handle uses `role="separator"` with current/min/max values.
