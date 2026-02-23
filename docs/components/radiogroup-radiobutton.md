# RadioGroup / RadioButton

## Purpose

Compose complete form workflows with predictable field state, validation, and submission behavior.
Standardize selection controls and grouped input patterns used across product settings and onboarding.

## Overview

Props (RadioGroup):

- `modelValue?: string | number | boolean` (v-model)
- `name?: string`
- `disabled?: boolean`
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `direction?: 'vertical' | 'horizontal'` (default `vertical`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (RadioButton):

- `value?: string | number | boolean`
- `label?: string`
- `disabled?: boolean`
- `name?: string`
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Props

- No additional props documented for this component at the moment.

## Events

- `RadioGroup`: `update:modelValue`, `change`
- `RadioButton`: `update:modelValue` (standalone mode), `change`

## Slots

- `RadioGroup`: default slot for `RadioButton` items
- `RadioButton`: default slot for label content

## Examples

```vue
<RadioGroup v-model="plan" direction="horizontal">
    <RadioButton value="basic">Basic</RadioButton>
    <RadioButton value="pro">Pro</RadioButton>
</RadioGroup>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify label/control alignment, helper text, and error presentation on narrow layouts.
Ensure grouped controls wrap cleanly and retain usable spacing for touch input.

## SSR/Hydration

Preserve initial form values, touched/error state defaults, and disabled/read-only semantics in SSR markup.
Hydrate without mutating field structure before first interaction.

## Testing

Cover submission lifecycle (valid/invalid/async), reset flows, and field-level state propagation.
Add tests for keyboard toggling, group navigation, and ARIA semantics for selection controls.

## Accessibility

- `RadioGroup` uses `role="radiogroup"` and supports group labels via `ariaLabel`/`ariaLabelledby`.
- Native radio inputs preserve expected keyboard behavior and checked-state semantics.
- Keep visible focus styles and contrast for radio indicator and label text.
