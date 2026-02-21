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

## Recipes

- First-run onboarding: launch tour after account creation with `startIndex=0`.
- Feature spotlight: pass concrete target selectors and per-step `placement` for complex pages.
- Progressive walkthrough: persist completion state and reopen only for new feature milestones.

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

- Panel uses `role="dialog"` and `aria-modal="true"`.
- On open, focus moves to tour panel; on close, focus restores to previously active element.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.

## Interaction Contract

- `modelValue=true`:
    - emits `open`
    - emits `stepChange` for initial step
    - resolves target and positions panel/spotlight
- Navigation:
    - `Back`/`Next` move between steps
    - last `Next` emits `complete` and closes
    - skip emits `skip` and closes
- Close reasons emitted via `close` payload: `overlay | esc | complete | skip`
- Behavior flags:
    - `closeOnOverlay=false` keeps tour open on mask click
    - `closeOnEsc=false` disables `Escape` close

## Z-Index Policy

- Tour root uses `--vf-tour-z-index` (default `120`).
- Spotlight and panel are layered inside tour root (`overlay` < `spotlight` < `panel`).
- Default intent:
    - above app content and modal/drawer base (`100`)
    - below notification center (`125`)
