# Textarea

Capture multi-line text with the same validation, accessibility, and sizing model as `Input`.

## Import

```ts
import { Textarea } from '@codemonster-ru/vueforge';
```

## Examples

Use `Textarea` when the final value is expected to span multiple lines or benefit from visible drafting space.

### Basic

Use the default textarea for descriptions, notes, and free-form comments.

```vue
<template>
    <Textarea v-model="bio" placeholder="Tell us about yourself" :rows="4" />
</template>
```

### Outlined

Use `outlined` when the surrounding card or panel already has strong visual boundaries.

```vue
<template>
    <Textarea v-model="summary" variant="outlined" placeholder="Write a short summary" :rows="3" />
</template>
```

### Sizes

Change `size` to align the field with the rest of a dense or spacious form layout.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Textarea v-model="smallNote" size="small" placeholder="Small textarea" :rows="3" />
        <Textarea v-model="normalNote" placeholder="Default textarea" :rows="4" />
        <Textarea v-model="largeNote" size="large" placeholder="Large textarea" :rows="5" />
    </div>
</template>
```

### Disabled And Readonly

Use `disabled` to fully block editing and `readonly` when users still need to review or copy the content.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Textarea v-model="disabledCopy" disabled placeholder="Disabled textarea" :rows="3" />
        <Textarea v-model="readonlyCopy" readonly :rows="4" />
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
- `autocomplete?: string`
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'`
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `rows?: number` (default `3`)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.textarea`.

## Tokens

Override via `theme.overrides.components.textarea`:

- `gap`, `fontSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `minHeight`, `resize`
- `small.padding`, `small.fontSize`
- `large.padding`, `large.fontSize`

## Recipes

- Keep `rows` aligned with the expected writing task so the field does not feel cramped or oversized.
- Use `readonly` when content may still need to be copied or reviewed after submission.
- Leave resizing enabled unless the page layout has a strict height contract that forbids it.

## Accessibility

- Provide an accessible name (`label` + `id`, or `ariaLabel` / `ariaLabelledby`).
- For help/error text, wire `ariaDescribedby`.
- For invalid and required states, use `ariaInvalid` / `required` (or `ariaRequired` override).
- Keyboard focus uses the component focus ring (`:focus-within`) for visible state.
