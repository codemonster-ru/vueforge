# Form

## Props

- `modelValue?: Record<string, unknown>` (v-model)
- `initialValues?: Record<string, unknown>`
- `validate?: (values) => Record<string, string> | string | boolean | null | Promise<...>`
- `validateOn?: 'submit' | 'input' | 'change' | 'blur' | Array<'submit' | 'input' | 'change' | 'blur'>` (default `submit`)
- `disabled?: boolean`
- `novalidate?: boolean` (default `true`)
- `id?: string`
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `change`
- `blur`
- `validate`
- `submit`
- `invalidSubmit`
- `reset`

## Slots

- `default` - form helpers:
  `{ values, errors, touched, isValid, isDirty, isSubmitting, setFieldValue, setFieldTouched, setFieldError, validate, submit, reset }`

## Examples

```vue
<Form v-model="values" :validate="validateForm" validate-on="blur" @submit="send">
    <template #default="{ values, errors, touched, setFieldValue, setFieldTouched }">
        <FormField label="Email" :error="touched.email ? errors.email : ''">
            <template #default>
                <Input
                    :model-value="String(values.email ?? '')"
                    @update:model-value="value => setFieldValue('email', value)"
                    @blur="() => setFieldTouched('email', true)"
                />
            </template>
        </FormField>
        <Button type="submit" label="Send" />
    </template>
</Form>
```

## Tokens

Component tokens (override via `theme.overrides.components.form`):

- `gap`, `textColor`, `disabledOpacity`

## Accessibility

- Use `ariaLabel` or `ariaLabelledby` on form container when needed.
- Pair controls with `FormField` to ensure label/hint/error relationships.
- Validation errors should be shown with clear, textual messages.
