# Tour

## Props

- `modelValue?: boolean` (v-model)
- `steps?: Array<{ target?: string | HTMLElement; title?: string; content?: string; placement?: 'top' | 'bottom' | 'left' | 'right'; offset?: number }>`
- `startIndex?: number` (default `0`)
- `placement?: 'top' | 'bottom' | 'left' | 'right'` (default `bottom`)
- `offset?: number` (default `10`)
- `mask?: boolean` (default `true`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showSkip?: boolean` (default `true`)
- `showProgress?: boolean` (default `true`)
- `spotlightPadding?: number` (default `6`)
- `nextLabel?: string` (default `Next`)
- `prevLabel?: string` (default `Back`)
- `finishLabel?: string` (default `Finish`)
- `skipLabel?: string` (default `Skip`)
- `ariaLabel?: string` (default `Tour`)

## Events

- `update:modelValue`
- `open`
- `close` (payload reason: `overlay | esc | complete | skip`)
- `stepChange`
- `next`
- `prev`
- `complete`
- `skip`

## Slots

- `default` - step content with slot props `{ step, index }`
- `title` (optional) - step title with slot props `{ step, index }`
- `actions` (optional) - custom actions with slot props `{ step, index, isFirst, isLast, prev, next, skip }`

## Examples

```vue
<Tour
    v-model="tourOpen"
    :steps="[
        { target: '#tour-start', title: 'Start', content: 'Launch onboarding here.' },
        { target: '#tour-search', title: 'Search', content: 'Find projects quickly.', placement: 'bottom' },
    ]"
/>
```

## Tokens

Component tokens (override via `theme.overrides.components.tour`):

- `zIndex`, `overlayBackgroundColor`
- `width`, `maxWidth`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `shadow`
- `titleGap`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `contentGap`, `contentFontSize`, `contentLineHeight`, `contentColor`
- `progressGap`, `progressFontSize`, `progressColor`
- `actionsGap`
- `buttonMinWidth`, `buttonPadding`, `buttonRadius`
- `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `secondaryButtonBorderColor`, `secondaryButtonBackgroundColor`, `secondaryButtonTextColor`, `secondaryButtonHoverBackgroundColor`
- `spotlightRadius`, `spotlightBorderWidth`, `spotlightBorderColor`
- `disabledOpacity`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
