# Form

## Props

- `modelValue?: Record<string, unknown>` (v-model)
- `initialValues?: Record<string, unknown>`
- `validate?: (values) => Record<string, string> | string | boolean | null | Promise<...>`
- `submit?: (values) => unknown | Promise<unknown>`
- `mapSubmitError?: (error, values) => Record<string, string> | string | boolean | null`
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
- `submitSuccess`
- `submitError`
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

## Recipes

### Async submit pattern

```vue
<Form
    v-model="values"
    :validate="validateForm"
    :submit="submitForm"
    :map-submit-error="mapSubmitError"
    validate-on="submit"
    @submit-success="onSubmitSuccess"
>
    <template #default="{ values, errors, isSubmitting, setFieldValue }">
        <Input :model-value="String(values.email ?? '')" @update:model-value="v => setFieldValue('email', v)" />
        <p>{{ errors._form }}</p>
        <Button type="submit" :loading="isSubmitting" label="Save" />
    </template>
</Form>
```

### API errors handling

```ts
const submitForm = async (values: Record<string, unknown>) => {
    await api.save(values);
};

const mapSubmitError = (error: unknown) => {
    if (isApiError(error) && error.fieldErrors) {
        return error.fieldErrors; // { email: 'Already used' }
    }

    return 'Unable to save form';
};
```

### Reset flow

```vue
<Form v-model="values" :initial-values="initialValues" @reset="onReset">
    <template #default="{ reset }">
        <Button type="button" label="Reset" @click="reset()" />
    </template>
</Form>
```

### Zod adapter example

```ts
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const validateWithZod = (values: Record<string, unknown>) => {
    const result = schema.safeParse(values);

    if (result.success) {
        return {};
    }

    return result.error.issues.reduce<Record<string, string>>((acc, issue) => {
        const key = String(issue.path[0] ?? '_form');
        acc[key] = issue.message;

        return acc;
    }, {});
};
```

### Yup adapter example

```ts
import * as yup from 'yup';

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
});

const validateWithYup = async (values: Record<string, unknown>) => {
    try {
        await schema.validate(values, { abortEarly: false });

        return {};
    } catch (error) {
        if (!(error instanceof yup.ValidationError)) {
            return 'Validation failed';
        }

        return error.inner.reduce<Record<string, string>>((acc, issue) => {
            const key = issue.path ?? '_form';
            acc[key] = issue.message;

            return acc;
        }, {});
    }
};
```

## Theming

- Override via `theme.overrides.components.form`.

## Tokens

Component tokens (override via `theme.overrides.components.form`):

- `gap`, `textColor`, `disabledOpacity`

## Accessibility

- Use `ariaLabel` or `ariaLabelledby` on form container when needed.
- Pair controls with `FormField` to ensure label/hint/error relationships.
- Validation errors should be shown with clear, textual messages.
