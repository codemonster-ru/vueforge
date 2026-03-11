# TagInput

Capture multiple selected or custom tokens inside one editable control.

## Import

```ts
import { TagInput } from '@codemonster-ru/vueforge';
```

## Examples

Use `TagInput` for skills, labels, recipients, and lightweight multi-value filter entry.

### Basic

Use options and allow custom tag creation when the field supports both known and ad hoc values.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const skills = ref<Array<string | number>>(['vue']);
</script>

<template>
    <TagInput
        v-model="skills"
        :options="[
            { label: 'Vue', value: 'vue' },
            { label: 'TypeScript', value: 'ts' },
            { label: 'Vitest', value: 'vitest' },
        ]"
        placeholder="Add skills"
        clearable
    />
</template>
```

### Fixed Options Only

Disable custom creation when values must come from a known set.

```vue
<template>
    <TagInput
        :model-value="['frontend']"
        :options="[
            { label: 'Frontend', value: 'frontend' },
            { label: 'Backend', value: 'backend' },
        ]"
        :allow-custom="false"
    />
</template>
```

### Max Tags

Use `maxTags` and `reject` when the field should stay bounded.

```vue
<template>
    <TagInput :model-value="['ops', 'infra']" :max-tags="3" @reject="onReject" />
</template>
```

## Props

- `modelValue?: Array<string | number>`
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `loading?: boolean` (default `false`)
- `loadingText?: string`
- `emptyText?: string`
- `filter?: boolean` (default `true`)
- `allowCustom?: boolean` (default `true`)
- `maxTags?: number`
- `clearable?: boolean` (default `false`)
- `validateTag?: (value: string) => boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `search`
- `add`
- `remove`
- `reject`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.taginput`.

## Tokens

Component tokens (override via `theme.overrides.components.taginput`):

- `minWidth`, `minHeight`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `inputMinWidth`
- `chipGap`, `chipPadding`, `chipRadius`, `chipBackgroundColor`, `chipTextColor`, `chipFontSize`
- `chipRemoveSize`, `chipRemoveRadius`, `chipRemoveHoverBackgroundColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`, `small.chipPadding`, `small.chipFontSize`
- `large.fontSize`, `large.padding`, `large.chipPadding`, `large.chipFontSize`

## Recipes

- Use `TagInput` when multiple values should remain visible and editable in-place.
- Disable custom tags when the field must stay normalized to a known taxonomy.
- Use `reject` to surface duplicate, invalid, readonly, or max-limit feedback in surrounding form logic.

## Accessibility

- Supports combobox and listbox interaction for suggestion browsing.
- Keyboard token creation is available through `Enter`, `Tab`, and comma.
- Backspace can remove the previous tag when the query is empty, and explicit remove buttons are available for each tag.
