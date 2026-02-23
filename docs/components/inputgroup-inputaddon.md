# InputGroup / InputAddon

## Purpose

Compose complete form workflows with predictable field state, validation, and submission behavior.
Standardize selection controls and grouped input patterns used across product settings and onboarding.

## Overview

Props (`InputGroup`):

- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (`InputAddon`):

- `as?: string` (default `span`)

## Props

- No additional props documented for this component at the moment.

## Events

- This component does not emit component-specific events.

## Slots

- `default` - group controls/addons content

## Examples

```vue
<InputGroup>
    <InputAddon>$</InputAddon>
    <NumberInput v-model="price" :min="0" :step="0.5" />
    <Button label="Apply" />
</InputGroup>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.inputGroup`):

- `gap`, `borderRadius`
- `addonPadding`, `addonFontSize`
- `addonBackgroundColor`, `addonOutlinedBackgroundColor`
- `addonTextColor`, `addonBorderColor`, `disabledOpacity`
- `small.addonPadding`, `small.addonFontSize`
- `large.addonPadding`, `large.addonFontSize`

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

- `InputGroup` exposes `role="group"` and supports group labelling via `ariaLabel`/`ariaLabelledby`.
- Use `InputAddon` for contextual text/symbols; keep interactive actions as focusable controls inside the group.
