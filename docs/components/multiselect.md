# MultiSelect

Select multiple options from a popup list while keeping chosen values visible as chips.

## Import

```ts
import { MultiSelect } from '@codemonster-ru/vueforge';
```

## Examples

Use `MultiSelect` when users need a bounded set of multiple values and the selected set should stay visible.

### Basic

Use the default variant for multi-value filters and settings panels.

```vue
<template>
    <MultiSelect
        v-model="countries"
        placeholder="Select countries"
        :options="[
            { label: 'Canada', value: 'ca' },
            { label: 'Germany', value: 'de' },
            { label: 'Japan', value: 'jp' },
            { label: 'United States', value: 'us' }
        ]"
    />
</template>
```

### Clearable

Turn on `clearable` when the whole selection can be reset in a single action.

```vue
<template>
    <MultiSelect
        v-model="labels"
        clearable
        placeholder="Select labels"
        :options="[
            { label: 'Bug', value: 'bug' },
            { label: 'Blocked', value: 'blocked' },
            { label: 'Customer', value: 'customer' },
            { label: 'Internal', value: 'internal' }
        ]"
    />
</template>
```

### Without Filter

Disable built-in filtering when the list is intentionally short and every option should stay visible.

```vue
<template>
    <MultiSelect
        v-model="days"
        :filter="false"
        placeholder="Select weekdays"
        :options="[
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' }
        ]"
    />
</template>
```

### Loading

Use loading state when options are still being fetched or recalculated.

```vue
<template>
    <MultiSelect v-model="reviewers" loading loading-text="Loading reviewers..." :options="[]" />
</template>
```

### Disabled And Readonly

Use `disabled` to block the whole control and `readonly` when the current chips should remain visible but fixed.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <MultiSelect
            v-model="disabledSelection"
            disabled
            placeholder="Disabled multiselect"
            :options="[{ label: 'Billing', value: 'billing' }]"
        />
        <MultiSelect
            v-model="readonlySelection"
            readonly
            :options="[
                { label: 'North America', value: 'na' },
                { label: 'Europe', value: 'eu' }
            ]"
        />
    </div>
</template>
```

## Props

- `modelValue?: Array<string | number>` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `searchPlaceholder?: string` (default `Search...`)
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `search`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via `theme.overrides.components.multiSelect`.

## Tokens

Override via `theme.overrides.components.multiSelect`:

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`, `focusBorderColor`, `hoverBorderColor`, `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `focusRingShadow`, `optionPadding`, `optionBorderRadius`, `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`, `loadingPadding`, `loadingColor`
- `searchPadding`, `searchBorderColor`, `searchBorderRadius`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.padding`, `small.fontSize`
- `large.padding`, `large.fontSize`

## Recipes

- Use `MultiSelect` when users need a stable set of multiple known values, not arbitrary free-text tags.
- Disable filtering for very short lists so users can scan all options at once.
- Prefer clear labels because selected items are echoed back as chips and become highly visible.

## Accessibility

- Keyboard support includes open/navigation/select via `ArrowDown`/`ArrowUp`/`Enter` and close via `Escape`.
- Selected values are shown as chips in the trigger and can be removed individually.
- `Backspace` on the trigger removes the last selected item.
- `clearable` provides a keyboard-accessible action to clear all selected items.
- In `readonly` mode, panel open/search and selection mutation interactions are blocked.
