# MentionInput

Capture free text while suggesting inline mentions triggered by special characters such as `@` or `#`.

## Import

```ts
import { MentionInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `MentionInput` for comments, messages, and note fields where users can reference people, channels, or topics inline.

### Basic

Use suggestions with multiple triggers for people and topics.

```vue
<template>
    <MentionInput
        model-value=""
        :suggestions="[
            { label: 'alice', value: 'alice', trigger: '@' },
            { label: 'frontend', value: 'frontend', trigger: '#' }
        ]"
        placeholder="Type @name or #topic"
    />
</template>
```

### Async Search

Use the `search` event when suggestions are fetched on demand.

```vue
<template>
    <MentionInput
        :model-value="message"
        :suggestions="mentionOptions"
        :loading="loading"
        @search="onMentionSearch"
        @update:model-value="message = $event"
    />
</template>
```

### Trigger Set

Restrict triggers when only one mention style is valid.

```vue
<template>
    <MentionInput :triggers="['@']" :suggestions="userOptions" />
</template>
```

## Props

- `modelValue?: string`
- `suggestions?: Array<{ label: string; value?: string | number; trigger?: string; disabled?: boolean }>` (default `[]`)
- `triggers?: Array<string>` (default `['@', '#']`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `required?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `autocomplete?: string` (default `off`)
- `inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'` (default `text`)
- `loading?: boolean` (default `false`)
- `loadingText?: string`
- `emptyText?: string`
- `minQueryLength?: number` (default `1`)
- `maxSuggestions?: number` (default `8`)
- `appendSpace?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Mention input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'`

## Events

- `update:modelValue`
- `input`
- `change`
- `search`
- `select`
- `insert`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.mentionInput`.

## Tokens

Component tokens (override via `theme.overrides.components.mentionInput`):

- `minWidth`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionGap`, `optionBorderRadius`, `optionFontSize`
- `optionHoverBackgroundColor`, `optionTriggerColor`
- `emptyPadding`, `emptyColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Use `search` to fetch or filter suggestions rather than overloading the component with remote logic.
- Keep trigger sets intentional; too many trigger characters make inline discovery noisy.
- Use `appendSpace=false` only when mentions should be embedded tightly into other syntax.

## Accessibility

- Input exposes combobox semantics including `aria-expanded`, `aria-controls`, and `aria-activedescendant`.
- Suggestion panel uses `listbox` and `option` semantics.
- Provide ARIA labelling and descriptions the same way you would for a standard text input.
