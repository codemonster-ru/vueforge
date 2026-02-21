# Starter Recipe: Auth Page

## Goal

Build a login page with `PageHeader`, `Form`, `FormField`, `Input`, and `Button`.

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue';

const values = ref<Record<string, unknown>>({ email: '', password: '' });

const validate = (next: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (!String(next.email ?? '').includes('@')) {
        errors.email = 'Enter a valid email';
    }
    if (String(next.password ?? '').length < 8) {
        errors.password = 'Minimum 8 characters';
    }

    return errors;
};
</script>

<template>
    <Section as="main" background="muted" padding-y="4rem">
        <Container size="sm">
            <Card>
                <PageHeader title="Sign in" subtitle="Access your workspace" />
                <Form v-model="values" :validate="validate" validate-on="blur">
                    <template #default="{ values: v, errors, touched, setFieldValue, setFieldTouched }">
                        <Stack gap="0.75rem">
                            <FormField label="Email" :error="touched.email ? errors.email : ''" required>
                                <template #default="{ id, describedBy, ariaInvalid, ariaRequired }">
                                    <Input
                                        :id="id"
                                        :model-value="String(v.email ?? '')"
                                        :aria-describedby="describedBy"
                                        :aria-invalid="ariaInvalid"
                                        :aria-required="ariaRequired"
                                        @update:model-value="value => setFieldValue('email', value)"
                                        @blur="() => setFieldTouched('email', true)"
                                    />
                                </template>
                            </FormField>
                            <FormField label="Password" :error="touched.password ? errors.password : ''" required>
                                <template #default="{ id, describedBy, ariaInvalid, ariaRequired }">
                                    <Input
                                        :id="id"
                                        type="password"
                                        :model-value="String(v.password ?? '')"
                                        :aria-describedby="describedBy"
                                        :aria-invalid="ariaInvalid"
                                        :aria-required="ariaRequired"
                                        @update:model-value="value => setFieldValue('password', value)"
                                        @blur="() => setFieldTouched('password', true)"
                                    />
                                </template>
                            </FormField>
                            <Button type="submit" label="Sign in" />
                        </Stack>
                    </template>
                </Form>
            </Card>
        </Container>
    </Section>
</template>
```
