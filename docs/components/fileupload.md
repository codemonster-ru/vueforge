# FileUpload

## Props

- `modelValue?: File | File[] | null` (v-model)
- `multiple?: boolean`
- `accept?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `maxSize?: number` (bytes)
- `maxFiles?: number`
- `placeholder?: string`
- `buttonLabel?: string` (default `Browse`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `reject` (payload: `Array<{ file: File; reason: 'maxSize' | 'maxFiles'; maxSize?: number; maxFiles?: number }>` )
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<FileUpload v-model="attachments" multiple :max-files="5" :max-size="10_000_000" />
```

## Tokens

Component tokens (override via `theme.overrides.components.fileUpload`):

- `minHeight`, `fontSize`, `gap`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`, `dragBackgroundColor`
- `listGap`, `itemPadding`, `itemBorderColor`, `itemBackgroundColor`, `itemRadius`, `itemTextColor`, `sizeTextColor`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `removeSize`, `removeRadius`, `removeHoverBackgroundColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
