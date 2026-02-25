# NavigationRail

## Purpose

- Provide compact app-level side navigation for SaaS layouts.
- Support collapsed/expanded states with icon+label patterns.

## Props

- `items?: Array<NavigationRailItem>`
- `modelValue?: string | number | null` (selected key)
- `collapsed?: boolean` (default `false`)
- `side?: 'left' | 'right'` (default `left`)
- `disabled?: boolean` (default `false`)
- `showToggle?: boolean` (default `true`)
- `ariaLabel?: string` (default `Primary navigation`)
- `collapseLabel?: string` (default `Collapse navigation`)
- `expandLabel?: string` (default `Expand navigation`)
- `collapseIcon?: string` (default `<`)
- `expandIcon?: string` (default `>`)
- `syncActiveFromRoute?: boolean` (default `true`)

## Events

- `update:modelValue`
- `update:collapsed`
- `select`
- `toggle`

## Slots

- `header` (optional) - slot props `{ collapsed, toggle }`
- `item` (optional) - slot props `{ item, index, active, collapsed }`
- `footer` (optional) - slot props `{ collapsed, toggle }`

## Example

```vue
<NavigationRail v-model="activeKey" v-model:collapsed="collapsed" :items="railItems">
    <template #header>
        <strong>Ops</strong>
    </template>
</NavigationRail>
```

## Tokens

Component tokens (override via `theme.overrides.components.navigationRail`):

- `width`, `collapsedWidth`, `padding`, `gap`
- `borderColor`, `backgroundColor`, `textColor`, `disabledOpacity`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `itemMinHeight`, `itemPadding`, `collapsedItemPadding`, `itemBorderRadius`
- `itemGap`, `itemContentGap`, `itemColor`, `itemHoverBackgroundColor`
- `itemActiveBackgroundColor`, `itemActiveColor`
- `iconSize`, `labelFontSize`

## Responsive

- Use `collapsed` state to fit narrow layout widths without removing navigation actions.

## SSR/Hydration

- Keep `collapsed` source controlled from app state for deterministic SSR output.

## Testing

- Covers collapse toggling, active selection, keyboard navigation, and route-synced active state.

## Accessibility

- Uses `nav` landmark + vertical `menu` semantics.
- Keyboard support: `ArrowUp/ArrowDown`, `Home/End`, `Enter/Space`.
