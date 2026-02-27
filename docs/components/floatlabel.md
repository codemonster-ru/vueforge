# FloatLabel

## Purpose

Utility wrapper for floating-label composition with input/select-like controls.

## Props

- `label?: string`
- `modelValue?: unknown`
- `value?: unknown` (preferred when wrapper is used without `v-model`)
- `active?: boolean` (forces floating state)
- `alwaysFloat?: boolean`
- `forId?: string` (maps `<label for="...">`)
- `required?: boolean`
- `disabled?: boolean`
- `invalid?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Slots

- `default` (control)
- `label` (optional custom label)

## Example

```vue
<FloatLabel label="Email" :value="email" for-id="email">
    <Input id="email" v-model="email" />
</FloatLabel>
```

## Tokens

Component tokens (override via `theme.overrides.components.floatLabel`):

- `labelOffsetX`, `labelFloatingTop`, `labelPadding`
- `labelFontSize`, `labelFloatingFontSize`
- `labelColor`, `labelFloatingColor`, `labelBackgroundColor`
- `requiredColor`, `invalidColor`, `transition`, `disabledOpacity`
- `small.labelFontSize`, `large.labelFontSize`

## Accessibility

- Uses native `<label>` association via `forId`.
- Required marker is decorative (`aria-hidden`).
