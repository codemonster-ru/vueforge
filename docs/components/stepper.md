# Stepper

## Props

- `modelValue?: string | number` (v-model)
- `steps?: Array<{ label?: string; description?: string; value?: string | number; disabled?: boolean; status?: 'completed' | 'active' | 'upcoming' | 'error' }>`
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `clickable?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `change`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Stepper v-model="step" :steps="steps" clickable />
<Stepper v-model="step" :steps="steps" orientation="vertical" size="small" />
```

## Tokens

Component tokens (override via `theme.overrides.components.stepper`):

- `gap`, `itemGap`, `lineThickness`, `lineLength`, `lineColor`
- `indicatorSize`, `indicatorBorderRadius`, `indicatorBorderWidth`, `indicatorFontSize`
- `indicatorBackgroundColor`, `indicatorTextColor`, `indicatorBorderColor`
- `activeIndicatorBackgroundColor`, `activeIndicatorTextColor`, `activeIndicatorBorderColor`
- `completedIndicatorBackgroundColor`, `completedIndicatorTextColor`, `completedIndicatorBorderColor`
- `errorIndicatorBackgroundColor`, `errorIndicatorTextColor`, `errorIndicatorBorderColor`
- `labelFontSize`, `labelColor`, `descriptionFontSize`, `descriptionColor`
- `disabledOpacity`
- `small.indicatorSize`, `small.indicatorFontSize`, `small.labelFontSize`, `small.descriptionFontSize`, `small.lineLength`, `small.itemGap`
- `large.indicatorSize`, `large.indicatorFontSize`, `large.labelFontSize`, `large.descriptionFontSize`, `large.lineLength`, `large.itemGap`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
