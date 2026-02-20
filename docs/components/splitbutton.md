# SplitButton

## Props

- `modelValue?: boolean` (dropdown open state)
- `items?: Array<SplitButtonItem>`
- `label?: string`
- `icon?: string`
- `type?: 'button' | 'submit' | 'reset'` (default `button`)
- `size?: 'small' | 'normal' | 'large'`
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: string`
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`)
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'`
- `offset?: number` (default `6`)
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `matchTriggerWidth?: boolean` (default `true`)
- `toggleAriaLabel?: string` (default `Toggle actions`)

`SplitButtonItem` supports:

- `label?: string`
- `to?: string`
- `href?: string`
- `url?: string`
- `icon?: string`
- `active?: boolean`
- `disabled?: boolean`
- `separator?: boolean`
- `command?: () => void`

## Events

- `click` (primary action)
- `update:modelValue`
- `open`
- `close`
- `select`

## Slots

- `default` (primary button content)
- `menu` (custom dropdown content)

## Examples

```vue
<SplitButton
    label="Save"
    :items="[
        { label: 'Save draft', command: saveDraft },
        { label: 'Save and publish', command: publish },
    ]"
    @click="save"
/>
```

## Tokens

Override via `theme.overrides.components.splitbutton`.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
