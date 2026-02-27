# SlideGroup

## Purpose

Scrollable horizontal group for chip/tab/button navigation patterns on constrained widths.

## Props

- `modelValue?: string | number | null`
- `items?: Array<SlideGroupItem>`
- `disabled?: boolean` (default `false`)
- `showControls?: boolean` (default `true`)
- `scrollStep?: number` (default `180`)
- `snap?: boolean` (default `true`)
- `ariaLabel?: string` (default `Slide group`)
- `prevLabel?: string` (default `Scroll left`)
- `nextLabel?: string` (default `Scroll right`)

## Events

- `update:modelValue`
- `change`

## Slots

- `item` (scoped: `{ item, index, active }`)
- `prev`
- `next`

## Example

```vue
<SlideGroup v-model="filter" :items="filters" />
```

## Tokens

Component tokens (override via `theme.overrides.components.slideGroup`):

- `gap`, `controlsGap`
- `controlSize`, `controlRadius`
- `controlBorderColor`, `controlBackgroundColor`, `controlTextColor`, `controlHoverBackgroundColor`
- `itemPadding`, `itemBorderRadius`
- `itemBorderColor`, `itemBackgroundColor`, `itemTextColor`
- `itemHoverBackgroundColor`
- `itemActiveBackgroundColor`, `itemActiveTextColor`, `itemActiveBorderColor`
- `disabledOpacity`

## Accessibility

- Uses keyboard navigation across items: `ArrowLeft/ArrowRight`, `Home/End`.
- Exposes group label via `ariaLabel`.
