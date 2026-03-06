# Input

Capture single-line text and numeric values with a lightweight, form-friendly API.

## Import

```ts
import { Input } from '@codemonster-ru/vueforge';
```

## Examples

Keep input examples close to real forms: short placeholders, clear state differences, and only the adornments users actually need.

### Basic

Use the default filled input for simple text entry in settings, auth, and CRUD forms.

```vue
<template>
    <Input v-model="email" type="email" placeholder="Email address" autocomplete="email" />
</template>
```

### Outlined

Use `outlined` when the surrounding surface is already visually heavy and the field should feel lighter.

```vue
<template>
    <Input v-model="search" variant="outlined" placeholder="Search projects" />
</template>
```

### Prefix And Suffix

Prefix and suffix slots work well for currency, domain, and compact search patterns.

```vue
<template>
    <Input v-model="workspace" placeholder="Workspace slug">
        <template #prefix>https://</template>
        <template #suffix>.vueforge.app</template>
    </Input>
</template>
```

### Sizes

Adjust density with `size` while keeping the interaction model unchanged.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Input v-model="smallValue" size="small" placeholder="Small input" />
        <Input v-model="normalValue" placeholder="Default input" />
        <Input v-model="largeValue" size="large" placeholder="Large input" />
    </div>
</template>
```

### Disabled And Readonly

Use `disabled` for unavailable controls and `readonly` when the value should remain selectable but not editable.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Input v-model="disabledValue" disabled placeholder="Disabled input" />
        <Input v-model="readonlyValue" readonly />
    </div>
</template>
```

## Props

- `modelValue?: string | number` (v-model, default `''`)
- `type?: string` (default `text`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string`
- `inputmode?: HTMLInputElement['inputMode']`
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- `prefix`
- `suffix`

## Theming

- Override via `theme.overrides.components.input`.

## Tokens

Override via `theme.overrides.components.input`:

- `gap`, `fontSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `small.padding`, `small.fontSize`
- `large.padding`, `large.fontSize`

## Recipes

- Use `type`, `autocomplete`, and `inputmode` together so mobile keyboards and browser autofill behave correctly.
- Prefer prefix or suffix content only when it shortens the task, not when it duplicates the label.
- Keep input formatting and validation messages outside the field unless the UX explicitly requires inline masking.

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
