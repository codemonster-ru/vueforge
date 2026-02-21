# Stepper

## Props

- `modelValue?: string | number` (v-model)
- `steps?: Array<{ label?: string; description?: string; value?: string | number; disabled?: boolean; status?: 'completed' | 'active' | 'upcoming' | 'error' }>`
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `clickable?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
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

## Recipes

### Checkout progress navigation

```vue
<Stepper
    v-model="checkoutStep"
    clickable
    :steps="[
        { value: 'cart', label: 'Cart' },
        { value: 'address', label: 'Address' },
        { value: 'payment', label: 'Payment' },
        { value: 'confirm', label: 'Confirm' },
    ]"
/>
```

### Error state for failed step validation

```vue
<Stepper
    v-model="step"
    :steps="[
        { value: 'account', label: 'Account', status: 'completed' },
        { value: 'plan', label: 'Plan', status: 'error', description: 'Fix validation errors' },
        { value: 'confirm', label: 'Confirm' },
    ]"
    clickable
/>
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

- Active step is announced with `aria-current="step"`.
- In clickable mode, keyboard navigation supports arrow keys and `Home`/`End` for step transitions.
- Global `disabled` state prevents interactive step transitions for consistent behavior with other navigation/disclosure components.
- Ensure visible focus state and sufficient color contrast in usage contexts.
