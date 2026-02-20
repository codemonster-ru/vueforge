# InlineEdit

## Props

- `modelValue?: string | number | null` (v-model)
- `type?: 'text' | 'number'` (default `text`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `editLabel?: string` (default `Edit`)
- `saveLabel?: string` (default `Save`)
- `cancelLabel?: string` (default `Cancel`)

## Events

- `update:modelValue`
- `save`
- `cancel`
- `start`
- `end`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<InlineEdit v-model="projectName" placeholder="No project name" />
<InlineEdit v-model="budget" type="number" variant="outlined" />
```

## Tokens

Component tokens (override via `theme.overrides.components.inlineEdit`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `actionsGap`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`
- `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `cancelButtonBackgroundColor`, `cancelButtonTextColor`, `cancelButtonBorderColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
