# FormField

Wrap a single field with its label, hint, error text, and ARIA wiring contract.

## Import

```ts
import { FormField } from '@codemonster-ru/vueforge';
```

## Examples

Use `FormField` when a control needs consistent label, hint, and error presentation without re-implementing ID wiring each time.

### Basic

Use the default slot props to connect a control to the generated ids.

```vue
<template>
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
</template>
```

### Required Field

Use `required` so the label marker and ARIA state stay aligned.

```vue
<template>
    <FormField label="Workspace name" required>
        <template #default="{ id, describedBy, ariaRequired }">
            <Input :id="id" :aria-describedby="describedBy" :aria-required="ariaRequired" />
        </template>
    </FormField>
</template>
```

### Custom Hint And Error

Override hint and error rendering with slots when the content needs formatting.

```vue
<template>
    <FormField label="Password" error="Password is too short">
        <template #default="{ id, describedBy, ariaInvalid }">
            <PasswordInput :id="id" :aria-describedby="describedBy" :aria-invalid="ariaInvalid" />
        </template>
        <template #hint>
            Use at least 12 characters.
        </template>
    </FormField>
</template>
```

## Props

- `id?: string`
- `label?: string`
- `hint?: string`
- `error?: string`
- `required?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` with `{ id, describedBy, invalid, required, ariaInvalid, ariaRequired }`
- `label`
- `hint`
- `error`

## Theming

- Override via `theme.overrides.components.formField`.

## Tokens

Component tokens (override via `theme.overrides.components.formField`):

- `gap`, `textColor`
- `labelFontSize`, `labelColor`, `requiredColor`
- `hintFontSize`, `hintColor`
- `errorColor`, `errorBorderColor`, `errorFocusBorderColor`
- `disabledOpacity`
- `small.gap`, `small.labelFontSize`, `small.hintFontSize`
- `large.gap`, `large.labelFontSize`, `large.hintFontSize`

## Recipes

- Always forward `describedBy`, `ariaInvalid`, and `ariaRequired` to the actual control when relevant.
- Use `FormField` as the canonical field wrapper instead of hand-assembling label and error markup repeatedly.
- Keep error messages short and actionable.

## Accessibility

- Wires `label for` and generated hint or error ids through slot props.
- Error content uses `role="alert"` so validation feedback is announced.
- Hint and error linkage should be forwarded to the nested control via `aria-describedby`.
