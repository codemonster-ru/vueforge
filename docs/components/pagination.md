# Pagination

## Purpose

Organize multi-section and multi-step workflows with explicit progression and navigation semantics.
Support dense information architecture in settings, onboarding, and detail screens.

## Props

- `modelValue?: number` (v-model, default `1`)
- `totalItems?: number` (default `0`)
- `pageSize?: number` (default `10`)
- `totalPages?: number` (optional override instead of `totalItems/pageSize`)
- `siblingCount?: number` (default `1`)
- `boundaryCount?: number` (default `1`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `prevLabel?: string` (default `Prev`)
- `nextLabel?: string` (default `Next`)
- `ellipsisLabel?: string` (default `...`)

## Events

- `update:modelValue`
- `change`

## Slots

- `indicator` - slot props: `{ step, index, status, active, completed, upcoming, error }`
- `step` - slot props: `{ step, index, status, active, completed, upcoming, error }`

## Examples

```vue
<Pagination v-model="page" :total-items="240" :page-size="20" />
```

## Theming

- Override via `theme.overrides.components.pagination`.

## Tokens

Component tokens (override via `theme.overrides.components.pagination`):

- `gap`, `itemMinWidth`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `hoverBackgroundColor`
- `activeBorderColor`, `activeBackgroundColor`, `activeTextColor`
- `focusBorderColor`, `focusRingShadow`
- `disabledOpacity`, `ellipsisPadding`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Standard list pagination with `totalItems` + `pageSize`.
- API-driven pagination where page is synced to route/query state.
- Dense table footer pagination using `size="small"`.

## Responsive

Validate tab/step headers for overflow, wrap, and scroll behavior on smaller viewports.
Ensure active indicator and navigation controls remain clear and tappable on touch devices.

## SSR/Hydration

Preserve initially active section/step state and panel visibility across server and client render.
Avoid hydration drift from client-only measurement used for indicator positioning.

## Testing

Cover controlled/uncontrolled active state, keyboard navigation, and disabled step/tab behavior.
Add tests for deep-link/page-state sync when applicable and ARIA tab/step semantics.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
