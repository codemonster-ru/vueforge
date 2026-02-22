# Textarea

## Purpose

Capture user text and numeric input with consistent API, validation hooks, and theming behavior.
Support high-frequency form entry scenarios in SaaS settings, auth, and CRUD flows.

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string`
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'`
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `rows?: number` (default `3`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<Textarea v-model="bio" placeholder="Tell us about yourself" rows="4" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate control height, helper/error text wrapping, and icon/addon placement across breakpoints.
Ensure virtual keyboards and touch interaction do not clip labels, hints, or action icons.

## SSR/Hydration

Keep initial value, disabled, and readonly states identical between server and client render.
Avoid hydration mismatches from client-only formatting or masking initialization.

## Testing

Cover v-model updates, input/change/blur events, and validation edge cases.
Add accessibility tests for labeling, error semantics, and keyboard interaction contracts.

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
