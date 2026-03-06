# Checkbox

Capture boolean consent and multi-select list choices with native checkbox semantics.

## Import

```ts
import { Checkbox } from '@codemonster-ru/vueforge';
```

## Examples

Use `Checkbox` for independent yes or no choices and list-style multi-selection.

### Basic

Use a checkbox for a single optional consent or preference.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const agreed = ref(false);
</script>

<template>
    <Checkbox v-model="agreed" label="I agree to the processing terms" />
</template>
```

### With Custom Label Content

Use the default slot when the label needs richer wording.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const marketing = ref(true);
</script>

<template>
    <Checkbox v-model="marketing">
        Email me release notes and onboarding tips
    </Checkbox>
</template>
```

### Outlined Variant

Switch to `outlined` when the control sits on a dense or tinted surface.

```vue
<template>
    <Checkbox :model-value="true" variant="outlined" label="Show archived projects" />
</template>
```

### Disabled State

Use `disabled` when the value is informative but not editable in the current context.

```vue
<template>
    <Stack gap="0.5rem">
        <Checkbox :model-value="true" disabled label="Security updates enabled" />
        <Checkbox :model-value="false" disabled label="Beta features enabled" />
    </Stack>
</template>
```

## Props

- `modelValue?: boolean` (v-model, default `false`)
- `label?: string`
- `disabled?: boolean` (default `false`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `id?: string`
- `name?: string`
- `required?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `change`

## Slots

- `default` - label content (fallbacks to `label`)

## Theming

- Override via `theme.overrides.components.checkbox`.

## Tokens

Component tokens (override via `theme.overrides.components.checkbox`):

- `size`, `gap`
- `borderRadius`, `checkBorderRadius`
- `borderColor`, `backgroundColor`
- `checkedBackgroundColor`, `checkedBorderColor`, `checkColor`
- `textColor`, `disabledOpacity`

## Recipes

- Use checkboxes for independent selections; if only one option may be chosen, use `RadioGroup`.
- Keep label text explicit so the checked state reads naturally.
- For long legal or settings labels, prefer slot content over squeezing everything into `label`.

## Accessibility

- Uses native `input[type="checkbox"]` semantics for keyboard and assistive technologies.
- Provide accessible naming via visible label text or `ariaLabel` or `ariaLabelledby`.
- Use `ariaDescribedby` for hint or error linkage and `ariaInvalid` or `ariaRequired` for state semantics.
