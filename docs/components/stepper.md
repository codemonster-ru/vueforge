# Stepper

Show multi-step progress or navigation state without owning the actual step content.

## Import

```ts
import { Stepper } from '@codemonster-ru/vueforge';
```

## Examples

Use `Stepper` when the UI needs an explicit progress indicator or clickable step navigation separate from the content panels themselves.

### Basic

Use it for checkout or onboarding progress.

```vue
<template>
    <Stepper
        v-model="step"
        :steps="[
            { value: 'cart', label: 'Cart' },
            { value: 'address', label: 'Address' },
            { value: 'payment', label: 'Payment' },
            { value: 'confirm', label: 'Confirm' },
        ]"
        clickable
    />
</template>
```

### Vertical

Use vertical layout in sidebars or narrow detail panels.

```vue
<template>
    <Stepper
        model-value="plan"
        orientation="vertical"
        size="small"
        :steps="[
            { value: 'account', label: 'Account' },
            { value: 'plan', label: 'Plan' },
            { value: 'confirm', label: 'Confirm' },
        ]"
    />
</template>
```

### Error State

Use explicit `status` when a step should communicate a problem.

```vue
<template>
    <Stepper
        model-value="plan"
        clickable
        :steps="[
            { value: 'account', label: 'Account', status: 'completed' },
            { value: 'plan', label: 'Plan', status: 'error', description: 'Fix validation errors' },
            { value: 'confirm', label: 'Confirm' },
        ]"
    />
</template>
```

## Props

- `modelValue?: string | number`
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

- `indicator`
- `step`

## Theming

- Override via `theme.overrides.components.stepper`.

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
- `small.*`
- `large.*`

## Recipes

- Use `Stepper` as a progress or navigation primitive, not a full step workflow manager.
- When the step headers and content panels are tightly coupled, wrap `Stepper` in a dedicated flow component at app level.
- Keep custom statuses explicit when the default active or completed inference is not enough.

## Accessibility

- Active step is exposed with `aria-current="step"`.
- In clickable mode, keyboard navigation supports arrow keys and `Home` or `End`.
- Disabled state prevents interactive transitions consistently across the entire stepper.
