# IftaLabel

## Purpose

Utility wrapper for in-field top-aligned labels (IFTA pattern) around input/select controls.

## Props

- `label?: string`
- `forId?: string`
- `required?: boolean`
- `disabled?: boolean`
- `invalid?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Slots

- `default` (control)
- `label` (optional custom label)

## Example

```vue
<IftaLabel label="Phone" for-id="phone">
    <Input id="phone" v-model="phone" />
</IftaLabel>
```

## Tokens

Component tokens (override via `theme.overrides.components.iftaLabel`):

- `offsetX`, `offsetY`, `padding`
- `fontSize`, `color`, `backgroundColor`
- `requiredColor`, `invalidColor`, `disabledOpacity`
- `small.fontSize`, `large.fontSize`

## Accessibility

- Uses native `<label>` association via `forId`.
- Required marker is decorative (`aria-hidden`).
