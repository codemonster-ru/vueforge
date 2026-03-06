# PasswordInput

Capture passwords with optional visibility toggle, strength feedback, and Caps Lock hints.

## Import

```ts
import { PasswordInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `PasswordInput` for authentication and credential setup flows where visibility and strength guidance reduce friction.

### Basic

Use the default password field when you want visibility toggle support without extra guidance.

```vue
<template>
    <PasswordInput v-model="password" placeholder="Password" />
</template>
```

### Strength Meter

Turn on `showStrength` in sign-up and reset-password flows where users need immediate quality feedback.

```vue
<template>
    <PasswordInput v-model="newPassword" placeholder="Create a password" show-strength />
</template>
```

### Without Toggle

Hide the toggle when product policy or context requires the value to stay masked.

```vue
<template>
    <PasswordInput v-model="pin" :show-toggle="false" placeholder="Temporary PIN" />
</template>
```

### Sizes

Adjust density with `size` to match the rest of the form.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <PasswordInput v-model="smallPassword" size="small" placeholder="Small password input" />
        <PasswordInput v-model="normalPassword" placeholder="Default password input" />
        <PasswordInput v-model="largePassword" size="large" placeholder="Large password input" />
    </div>
</template>
```

### Disabled And Readonly

Use `disabled` for unavailable credential fields and `readonly` when the value must stay visible to assistive tech but uneditable.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <PasswordInput v-model="disabledPassword" disabled placeholder="Disabled password input" />
        <PasswordInput v-model="readonlyPassword" readonly />
    </div>
</template>
```

## Props

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `current-password`)
- `showToggle?: boolean` (default `true`)
- `showStrength?: boolean` (default `false`)
- `showCapsLockHint?: boolean` (default `true`)
- `revealLabel?: string` (default `Show password`)
- `hideLabel?: string` (default `Hide password`)
- `revealText?: string` (default `Show`)
- `hideText?: string` (default `Hide`)
- `capsLockHint?: string` (default `Caps Lock is on`)
- `weakLabel?: string` (default `Weak password`)
- `mediumLabel?: string` (default `Medium password`)
- `strongLabel?: string` (default `Strong password`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Password input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `toggleVisibility` (payload: `boolean`)

## Slots

- `prefix`
- `suffix`

## Theming

- Override via `theme.overrides.components.passwordInput`.

## Tokens

Component tokens (override via `theme.overrides.components.passwordInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `toggleSize`, `toggleRadius`, `toggleColor`, `toggleHoverBackgroundColor`
- `strengthGap`, `strengthTrackHeight`, `strengthTrackRadius`, `strengthTrackBackgroundColor`
- `strengthWeakColor`, `strengthMediumColor`, `strengthStrongColor`
- `metaFontSize`, `hintColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Enable `showStrength` for password creation, but skip it for quick login forms where it only adds noise.
- Keep `autocomplete` aligned with the actual task: `current-password` for login, `new-password` for reset/create flows.
- Leave Caps Lock hints enabled unless the product already has a stronger keyboard-state affordance.

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Visibility toggle is a native `button`, so it is keyboard accessible by default.
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
