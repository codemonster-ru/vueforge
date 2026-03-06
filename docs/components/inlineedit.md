# InlineEdit

Edit a single scalar value inline with built-in save and cancel controls.

## Import

```ts
import { InlineEdit } from '@codemonster-ru/vueforge';
```

## Examples

Use `InlineEdit` when one text or numeric value should flip directly into edit mode without custom slot wiring.

### Basic

Use it for quick text edits like project names or titles.

```vue
<template>
    <InlineEdit v-model="projectName" placeholder="No project name" />
</template>
```

### Numeric Value

Use `type="number"` for compact numeric editing.

```vue
<template>
    <InlineEdit v-model="budget" type="number" variant="outlined" />
</template>
```

### Small Dense Layout

Use the small size for tables or compact summary rows.

```vue
<template>
    <InlineEdit model-value="Owner" size="small" />
</template>
```

## Props

- `modelValue?: string | number | null`
- `type?: 'text' | 'number'` (default `text`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `editLabel?: string` (default `Edit`)
- `saveLabel?: string` (default `Save`)
- `cancelLabel?: string` (default `Cancel`)

## Events

- `update:modelValue`
- `save`
- `cancel`
- `start`
- `end`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.inlineEdit`.

## Tokens

Component tokens (override via `theme.overrides.components.inlineEdit`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `actionsGap`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`
- `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `cancelButtonBackgroundColor`, `cancelButtonTextColor`, `cancelButtonBorderColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## Recipes

- Use `InlineEdit` for single-value edits that should stay embedded in the surrounding view.
- Prefer `Inplace` when the active state needs custom content, multiple controls, or custom actions.
- Keep labels explicit so edit, save, and cancel actions remain understandable in repetitive lists.

## Accessibility

- Editing flow supports keyboard-first interaction with `Enter` to save and `Escape` to cancel.
- In `readonly` mode, the value remains visible and non-interactive.
- Keep button labels clear, especially when many inline editors appear in one view.
