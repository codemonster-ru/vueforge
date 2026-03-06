# Form

Coordinate form values, validation, touched state, and async submission in one controlled workflow container.

## Import

```ts
import { Form } from '@codemonster-ru/vueforge';
```

## Examples

Use `Form` when the page needs centralized validation and submission orchestration rather than ad hoc field handlers.

### Basic

Use the default slot helpers to wire controls to form state.

```vue
<template>
    <Form v-model="values" :validate="validateForm" validate-on="blur" @submit="send">
        <template #default="{ values, errors, touched, setFieldValue, setFieldTouched }">
            <FormField label="Email" :error="touched.email ? errors.email : ''">
                <template #default="{ id, describedBy, ariaInvalid, ariaRequired }">
                    <Input
                        :id="id"
                        :model-value="String(values.email ?? '')"
                        :aria-describedby="describedBy"
                        :aria-invalid="ariaInvalid"
                        :aria-required="ariaRequired"
                        @update:model-value="value => setFieldValue('email', value)"
                        @blur="() => setFieldTouched('email', true)"
                    />
                </template>
            </FormField>
            <Button type="submit" label="Send" />
        </template>
    </Form>
</template>
```

### Async Submit

Use `submit` and `mapSubmitError` when saving is asynchronous and server errors need to map back into form state.

```vue
<template>
    <Form
        v-model="values"
        :validate="validateForm"
        :submit="submitForm"
        :map-submit-error="mapSubmitError"
        @submit-success="onSubmitSuccess"
    >
        <template #default="{ values, errors, isSubmitting, setFieldValue }">
            <Input :model-value="String(values.email ?? '')" @update:model-value="v => setFieldValue('email', v)" />
            <p>{{ errors._form }}</p>
            <Button type="submit" :loading="isSubmitting" label="Save" />
        </template>
    </Form>
</template>
```

### Reset To Initial Values

Use `initialValues` when the form should be able to restore a known baseline.

```vue
<template>
    <Form v-model="values" :initial-values="initialValues">
        <template #default="{ reset }">
            <Button type="button" label="Reset" @click="reset()" />
        </template>
    </Form>
</template>
```

## Props

- `modelValue?: Record<string, unknown>`
- `initialValues?: Record<string, unknown>`
- `validate?: (values) => Record<string, string> | string | boolean | null | Promise<...>`
- `submit?: (values) => unknown | Promise<unknown>`
- `mapSubmitError?: (error, values) => Record<string, string> | string | boolean | null`
- `validateOn?: 'submit' | 'input' | 'change' | 'blur' | Array<'submit' | 'input' | 'change' | 'blur'>` (default `submit`)
- `disabled?: boolean` (default `false`)
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
- `submitSuccess`
- `submitError`
- `invalidSubmit`
- `reset`

## Slots

- `default` with `{ values, errors, touched, isValid, isDirty, isSubmitting, setFieldValue, setFieldTouched, setFieldError, validate, submit, reset }`

## Theming

- Override via `theme.overrides.components.form`.

## Tokens

Component tokens (override via `theme.overrides.components.form`):

- `gap`, `textColor`, `disabledOpacity`

## Recipes

- Use `Form` when field values, validation, and submit lifecycle belong to one coherent unit.
- Keep validators side-effect free; use `submit` for I/O and `validate` for state checks.
- Pair it with `FormField` so labels, hints, and errors stay consistently wired.

## Accessibility

- Provide `ariaLabel` or `ariaLabelledby` when the form needs explicit naming.
- Validation errors should remain textual and actionable.
- Use `FormField` slot props to wire control labelling and descriptions correctly.
