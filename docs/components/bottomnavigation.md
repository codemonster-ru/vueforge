# BottomNavigation

## Purpose

- Provide mobile-first primary app navigation anchored to the bottom edge.
- Support icon-first actions with optional labels and badge counters.

## Props

- `items?: Array<BottomNavigationItem>`
- `modelValue?: string | number | null` (selected key)
- `disabled?: boolean` (default `false`)
- `fixed?: boolean` (default `true`)
- `mobileOnly?: boolean` (default `true`)
- `showLabels?: boolean` (default `true`)
- `ariaLabel?: string` (default `Bottom navigation`)
- `syncActiveFromRoute?: boolean` (default `true`)

## Events

- `update:modelValue`
- `select`

## Example

```vue
<BottomNavigation v-model="active" :items="items" />
```

## Tokens

Component tokens (override via `theme.overrides.components.bottomNavigation`):

- `height`, `padding`, `gap`
- `borderColor`, `backgroundColor`, `textColor`, `zIndex`, `disabledOpacity`
- `itemMinHeight`, `itemPadding`, `itemBorderRadius`, `itemContentGap`
- `itemColor`, `itemHoverBackgroundColor`
- `itemActiveBackgroundColor`, `itemActiveColor`
- `iconSize`, `labelFontSize`
- `badgeTextColor`, `badgeBackgroundColor`

## Responsive

- With `mobileOnly=true`, navigation is hidden at desktop widths (`min-width: 769px`).
- Set `mobileOnly=false` to keep it visible across breakpoints.

## Accessibility

- Uses `nav` landmark + horizontal `menubar` semantics.
- Keyboard support: `ArrowLeft/ArrowRight`, `Home/End`, `Enter/Space`.
