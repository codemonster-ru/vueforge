# MaskedInput

Capture formatted text input while preserving a predictable value contract.

## Import

```ts
import { MaskedInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `MaskedInput` when the user should enter a value in a fixed pattern such as phone, code, or license format.

### Basic

Use a string mask for common formats.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const phone = ref('');
</script>

<template>
    <MaskedInput v-model="phone" mask="+7 (###) ###-##-##" placeholder="+7 (___) ___-__-__" />
</template>
```

### Unmasked Value

Set `unmask` when the bound model should contain only the raw token characters.

```vue
<template>
    <MaskedInput model-value="AA1234" mask="AA-####" unmask variant="outlined" />
</template>
```

### With Prefix Or Suffix

Use the wrapper slots for fixed surrounding context.

```vue
<template>
    <MaskedInput mask="#### #### #### ####">
        <template #prefix>Card</template>
    </MaskedInput>
</template>
```

## Props

- `modelValue?: string`
- `mask?: string | ((value: string) => string)` (default `''`)
- `placeholder?: string`
- `placeholderChar?: string` (default `_`)
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `off`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `text`)
- `ariaLabel?: string` (default `Masked input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'`
- `unmask?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `complete`

## Slots

- `prefix`
- `suffix`

## Theming

- Override via `theme.overrides.components.maskedInput`.

## Tokens

Component tokens (override via `theme.overrides.components.maskedInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Use masks to guide format, not to hide validation complexity that still belongs in form logic.
- Set `unmask` when downstream systems expect raw data without separators.
- Prefer plain `Input` when the format is too flexible for a stable mask.

## Accessibility

- Provide an accessible name through label association or ARIA labelling.
- Use `ariaDescribedby` for help or validation text.
- `complete` is useful for form logic but should not replace validation feedback.
