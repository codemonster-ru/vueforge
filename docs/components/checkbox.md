# Checkbox

## Purpose

Compose complete form workflows with predictable field state, validation, and submission behavior.
Standardize selection controls and grouped input patterns used across product settings and onboarding.

## Props

- `modelValue?: boolean` (v-model, default `false`)
- `label?: string`
- `disabled?: boolean` (default `false`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`

## Slots

- `default` (label content)

## Examples

```vue
<Checkbox v-model="agreed" label="I agree" />
<Checkbox v-model="agreed" variant="outlined">Custom label</Checkbox>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Override via `theme.overrides.components.checkbox`.

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

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
