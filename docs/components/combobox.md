# Combobox

Combine free typing with option picking when users may search, select, or commit a custom value.

## Import

```ts
import { Combobox } from '@codemonster-ru/vueforge';
```

## Examples

Use `Combobox` when the typed query matters as much as the selected value, or when custom creation is allowed.

### Basic

Use a strict combobox when users should search and then choose an existing option.

```vue
<template>
    <Combobox
        v-model="countryId"
        v-model:inputValue="countryQuery"
        placeholder="Pick a country"
        :options="[
            { label: 'Canada', value: 'ca' },
            { label: 'Germany', value: 'de' },
            { label: 'Japan', value: 'jp' },
            { label: 'United States', value: 'us' }
        ]"
    />
</template>
```

### Create New Value

Use `allowCreate` when users may commit a custom value that is not yet present in the options list.

```vue
<template>
    <Combobox
        v-model="tag"
        v-model:inputValue="tagQuery"
        allow-create
        :strict="false"
        placeholder="Add or choose a tag"
        :options="[
            { label: 'Backend', value: 'backend' },
            { label: 'Design', value: 'design' },
            { label: 'Frontend', value: 'frontend' }
        ]"
    />
</template>
```

### Clearable

Turn on `clearable` when both the selected value and the typed query should be reset quickly.

```vue
<template>
    <Combobox
        v-model="ownerId"
        v-model:inputValue="ownerQuery"
        clearable
        placeholder="Choose an owner"
        :options="[
            { label: 'Ava Patel', value: 'ava' },
            { label: 'Maksim Ivanov', value: 'maksim' },
            { label: 'Wei Chen', value: 'wei' }
        ]"
    />
</template>
```

### Loading

Use the loading state while remote suggestions are still being resolved for the current query.

```vue
<template>
    <Combobox
        v-model="repository"
        v-model:inputValue="repositoryQuery"
        loading
        loading-text="Searching repositories..."
        placeholder="Search repositories"
        :options="[]"
    />
</template>
```

### Disabled And Readonly

Use `disabled` when the control is unavailable and `readonly` when the current value must remain visible but not changeable.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Combobox
            v-model="disabledValue"
            v-model:inputValue="disabledQuery"
            disabled
            placeholder="Disabled combobox"
            :options="[{ label: 'Enterprise', value: 'enterprise' }]"
        />
        <Combobox
            v-model="readonlyValue"
            v-model:inputValue="readonlyQuery"
            readonly
            :options="[
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' }
            ]"
        />
    </div>
</template>
```

## Props

- `modelValue?: string | number` (v-model selected value)
- `inputValue?: string` (v-model:inputValue typed query)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `strict?: boolean` (default `true`)
- `allowCreate?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `ariaLabel?: string` (default `Combobox input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `update:inputValue`
- `change`
- `search`
- `create`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via `theme.overrides.components.combobox`.

## Tokens

Component tokens (override via `theme.overrides.components.combobox`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Use `Combobox` instead of `Autocomplete` when you need separate control over typed query and committed value.
- Keep `strict=true` when only known options are valid; relax it only when custom values are truly supported downstream.
- Pair `allowCreate` with explicit `create` handling so newly committed values are not lost after selection.

## Accessibility

- Input uses combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`).
- Keyboard support: `ArrowDown`/`ArrowUp` navigate highlighted option, `Enter` selects highlighted option or commits custom value according to `strict`/`allowCreate`, `Escape` closes panel.
- In `readonly` mode, search/open interactions are blocked.
