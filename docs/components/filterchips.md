# FilterChips

## Purpose

Render and manage high-density operational data with scalable interaction patterns.
Support filtering, navigation, and bulk workflows used in core SaaS backoffice screens.

## Props

- `modelValue?: string | number | Array<string | number> | null` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean; count?: number }>` (default `[]`)
- `multiple?: boolean` (default `true`)
- `allowEmpty?: boolean` (default `true`, used in single mode)
- `clearable?: boolean` (default `false`)
- `clearText?: string` (default `Clear`)
- `clearLabel?: string` (default `Clear filters`)
- `disabled?: boolean`
- `wrap?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'soft' | 'outline' | 'solid'` (default `soft`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `change`
- `clear`

## Slots

- This component does not expose named slots.

## Examples

```vue
<FilterChips
    v-model="activeFilters"
    :options="[
        { label: 'Open', value: 'open', count: 12 },
        { label: 'In progress', value: 'progress', count: 7 },
        { label: 'Done', value: 'done', count: 18 },
    ]"
    clearable
/>
<FilterChips v-model="activeStatus" :options="statusOptions" :multiple="false" variant="outline" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.filterChips`):

- `fontSize`, `gap`
- `chipGap`, `chipPadding`, `chipBorderRadius`
- `chipBorderColor`, `chipBackgroundColor`, `chipTextColor`
- `chipHoverBackgroundColor`, `chipHoverBorderColor`
- `chipActiveBackgroundColor`, `chipActiveBorderColor`, `chipActiveTextColor`
- `chipSolidActiveBackgroundColor`, `chipSolidActiveBorderColor`, `chipSolidActiveTextColor`
- `countPadding`, `countFontSize`, `countBackgroundColor`, `countTextColor`
- `countActiveBackgroundColor`, `countActiveTextColor`
- `disabledOpacity`
- `small.fontSize`, `small.chipPadding`
- `large.fontSize`, `large.chipPadding`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate table/list density, horizontal overflow strategy, and virtualization behavior across breakpoints.
Ensure row/item actions remain accessible and discoverable on touch devices.

## SSR/Hydration

Render initial viewport slice and structural wrappers deterministically to avoid hydration drift.
Defer measurement-driven virtualization logic until client mount.

## Testing

Cover sorting/filtering/selection/navigation flows and large-dataset edge cases.
Add performance-sensitive regression tests and ARIA verification for interactive data regions.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
