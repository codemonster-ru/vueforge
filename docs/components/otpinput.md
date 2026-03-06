# OtpInput

Capture a one-time code across multiple fixed cells with paste and keyboard support.

## Import

```ts
import { OtpInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `OtpInput` for verification codes, backup codes, and other short fixed-length authentication tokens.

### Basic

Use the default six-cell numeric code entry.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const otp = ref('');
</script>

<template>
    <OtpInput v-model="otp" :length="6" />
</template>
```

### Alphanumeric

Enable `alphanumeric` for backup codes or mixed-character tokens.

```vue
<template>
    <OtpInput model-value="A1B2C3D4" :length="8" alphanumeric variant="outlined" />
</template>
```

### Auto Focus

Use `autoFocus` when the code input is the next immediate task after navigation.

```vue
<template>
    <OtpInput :length="4" auto-focus />
</template>
```

## Props

- `modelValue?: string`
- `length?: number` (default `6`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `mask?: boolean` (default `false`)
- `alphanumeric?: boolean` (default `false`)
- `autocomplete?: string` (default `one-time-code`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `numeric`)
- `autoFocus?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `OTP input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'`
- `cellAriaLabelPrefix?: string` (default `OTP digit`)

## Events

- `update:modelValue`
- `change`
- `complete`
- `focus`
- `blur`
- `paste`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.otpInput`.

## Tokens

Component tokens (override via `theme.overrides.components.otpInput`):

- `gap`, `fontSize`, `cellSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.cellSize`, `small.fontSize`, `small.padding`
- `large.cellSize`, `large.fontSize`, `large.padding`

## Recipes

- Use `OtpInput` when the code is fixed-length and benefits from one-character-per-cell scanning.
- Keep `autoFocus` reserved for flows where the code step is unquestionably next.
- Prefer alphanumeric mode for recovery codes and numeric mode for SMS or authenticator codes.

## Accessibility

- Root uses `role="group"` and supports ARIA labelling and descriptions.
- Each cell exposes a generated label such as `OTP digit 1 of 6`.
- Keyboard supports left or right navigation, backspace clearing, and paste distribution.
