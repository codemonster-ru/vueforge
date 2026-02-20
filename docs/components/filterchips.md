# FilterChips

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

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
