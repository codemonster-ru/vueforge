# FormField

## Purpose

Compose complete form workflows with predictable field state, validation, and submission behavior.
Standardize selection controls and grouped input patterns used across product settings and onboarding.

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

- `default` - form control wrapper slot props:
  `{ id, describedBy, invalid, required, ariaInvalid, ariaRequired }`
- `label` (optional)
- `hint` (optional)
- `error` (optional)

## Examples

```vue
<FormField label="Email" hint="We never share it" :error="emailError">
    <template #default="{ id, describedBy, ariaInvalid, ariaRequired }">
        <Input
            :id="id"
            v-model="email"
            :aria-describedby="describedBy"
            :aria-invalid="ariaInvalid"
            :aria-required="ariaRequired"
            placeholder="name@example.com"
        />
    </template>
</FormField>
```

When `error` is set, `FormField` applies invalid-state border highlighting to nested form controls.
Customize these colors via `theme.overrides.components.formField.errorBorderColor` and `errorFocusBorderColor`.

## Theming

- Override via `theme.overrides.components.formField`.

## Tokens

- Use `theme.overrides.components` to customize this component where token support is available.

## Recipes

- Standard labeled input row with hint/error linkage through slot props.
- Required field row with explicit `required` and mapped `aria-required`/`aria-invalid` on control.
- Compact field rows using `size="small"` in dense forms.

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

- `FormField` wires `label for` and passes generated ids to controls through slot props.
- Use `describedBy` on controls so hint/error text is announced by assistive technologies.
- Error message region uses `role="alert"` and should contain short actionable text.

## Do / Don't

```vue
<!-- Do -->
<FormField label="Email" hint="Work email only" :error="errors.email" required>
    <template #default="{ id, describedBy, ariaInvalid, ariaRequired }">
        <Input
            :id="id"
            v-model="values.email"
            :aria-describedby="describedBy"
            :aria-invalid="ariaInvalid"
            :aria-required="ariaRequired"
        />
    </template>
</FormField>

<!-- Don't -->
<FormField label="Email" :error="errors.email">
    <template #default="{ id }">
        <Input :id="id" v-model="values.email" />
        <!-- Missing aria-describedby and invalid/required aria mapping -->
    </template>
</FormField>
```
