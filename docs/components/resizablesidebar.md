# ResizableSidebar

ResizableSidebar provides a collapsible sidebar with drag resize and optional persisted state.

## Import

```ts
import ResizableSidebar from '@/package/components/resizable-sidebar.vue';
```

## Examples

### Basic

Use `ResizableSidebar` for navigation, inspectors, or workspace side panels that users should size themselves.

```vue
<ResizableSidebar v-model="sidebarWidth">
    <NavigationRail />
</ResizableSidebar>
```

### Controlled Collapse

Control collapsed state explicitly when the shell tracks sidebar visibility.

```vue
<ResizableSidebar
    v-model="sidebarWidth"
    v-model:collapsed="sidebarCollapsed"
>
    <NavigationRail :collapsed="sidebarCollapsed" />
</ResizableSidebar>
```

### Persistence

Enable persistence when sidebar width and collapsed state are durable workspace preferences.

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

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `number` | `280` |
| `collapsed` | `boolean` | `false` |
| `minWidth` | `number` | `200` |
| `maxWidth` | `number` | `480` |
| `collapsedWidth` | `number` | `56` |
| `side` | `'left' \| 'right'` | `'left'` |
| `resizable` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `showToggle` | `boolean` | `true` |
| `persistence` | `'none' \| 'local' \| 'session'` | `'none'` |
| `persistenceKey` | `string` | `''` |
| `ariaLabel` | `string` | `'Sidebar'` |
| `collapseLabel` | `string` | `'Collapse sidebar'` |
| `expandLabel` | `string` | `'Expand sidebar'` |
| `collapseIcon` | `string` | `'chevronLeft'` |
| `expandIcon` | `string` | `'chevronRight'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `number` |
| `update:collapsed` | `boolean` |
| `resize-end` | `number` |

### Slots

| Name | Description |
| --- | --- |
| `header` | Header content with `{ collapsed, toggle, width }`. |
| `default` | Main sidebar content with `{ collapsed, width }`. |
| `footer` | Footer content with `{ collapsed, toggle, width }`. |

## Theming

Override component tokens through `theme.overrides.components.resizableSidebar`.

## Tokens

- `backgroundColor`
- `textColor`
- `borderColor`
- `disabledOpacity`
- `sectionPadding`
- `contentPadding`
- `toggleMargin`
- `toggleSize`
- `toggleBorderRadius`
- `toggleBorderColor`
- `toggleBackgroundColor`
- `toggleTextColor`
- `resizerSize`

## Recipes

- Use persistence only when the sidebar is part of a personal workspace preference rather than a transient route-level state.
- Prefer `side="right"` for inspector panels and `side="left"` for navigation-heavy shells.

## Accessibility

- The resize handle exposes `role="separator"` with current, minimum, and maximum values.
- Keyboard resizing works through the separator, not only pointer drag.
