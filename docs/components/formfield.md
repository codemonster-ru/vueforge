# FormField

## Props

- `id?: string` (used in `label for` and slot props)
- `label?: string`
- `hint?: string`
- `error?: string`
- `required?: boolean`
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - form control wrapper slot props: `{ id, describedBy, invalid, required }`
- `label` (optional)
- `hint` (optional)
- `error` (optional)

## Examples

```vue
<FormField label="Email" hint="We never share it" :error="emailError">
    <template #default="{ id, describedBy }">
        <Input :id="id" v-model="email" :aria-describedby="describedBy" placeholder="name@example.com" />
    </template>
</FormField>
```

When `error` is set, `FormField` applies invalid-state border highlighting to nested form controls.
Customize these colors via `theme.overrides.components.formField.errorBorderColor` and `errorFocusBorderColor`.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
