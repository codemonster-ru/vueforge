# Autocomplete

Search and select options with combobox behavior for small lists, grouped data, and larger datasets.

## Import

```ts
import { Autocomplete } from '@codemonster-ru/vueforge';
```

## Examples

Prefer short, realistic data samples. The best examples show selection behavior directly rather than abstract API shapes.

### Basic

Use a single-value autocomplete for common form fields and toolbar filters.

```vue
<template>
    <Autocomplete
        v-model="country"
        placeholder="Select a country"
        :options="[
            { label: 'Canada', value: 'ca' },
            { label: 'Germany', value: 'de' },
            { label: 'Japan', value: 'jp' },
            { label: 'United States', value: 'us' },
        ]"
    />
</template>
```

### Multiple

Enable `multiple` to collect tags, assignees, or watchers while keeping selected values visible as chips.

```vue
<template>
    <Autocomplete
        v-model="assignees"
        multiple
        placeholder="Assign teammates"
        :options="[
            { label: 'Ava Patel', value: 'ava' },
            { label: 'Maksim Ivanov', value: 'maksim' },
            { label: 'Nora Smith', value: 'nora' },
            { label: 'Wei Chen', value: 'wei' },
        ]"
    />
</template>
```

### Grouped

Use grouped data when options belong to clear categories and the group context helps scanning.

```vue
<template>
    <Autocomplete
        v-model="city"
        grouped
        placeholder="Choose a city"
        :options="[
            {
                label: 'North America',
                items: [
                    { label: 'New York', value: 'new-york' },
                    { label: 'Toronto', value: 'toronto' },
                ],
            },
            {
                label: 'Europe',
                items: [
                    { label: 'Berlin', value: 'berlin' },
                    { label: 'Prague', value: 'prague' },
                ],
            },
        ]"
    />
</template>
```

### States

Use loading, disabled, and readonly states to keep async and permission-driven flows explicit.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Autocomplete
            v-model="loadingValue"
            loading
            loading-text="Searching repositories..."
            placeholder="Loading state"
            :options="[]"
        />
        <Autocomplete
            v-model="disabledValue"
            disabled
            placeholder="Disabled state"
            :options="[{ label: 'Invoices', value: 'invoices' }]"
        />
        <Autocomplete
            v-model="readonlyValue"
            readonly
            placeholder="Readonly state"
            :options="[{ label: 'Enterprise plan', value: 'enterprise' }]"
        />
    </div>
</template>
```

### Virtualized Lists

Enable virtualization for long lists to keep scrolling and keyboard navigation responsive.

```vue
<template>
    <Autocomplete
        v-model="metric"
        virtual
        :virtual-threshold="5"
        :virtual-item-height="36"
        placeholder="Pick a metric"
        :options="[
            { label: 'Activation rate', value: 'activation-rate' },
            { label: 'Average order value', value: 'average-order-value' },
            { label: 'Bounce rate', value: 'bounce-rate' },
            { label: 'Churn risk', value: 'churn-risk' },
            { label: 'Expansion MRR', value: 'expansion-mrr' },
            { label: 'Gross margin', value: 'gross-margin' },
            { label: 'Lead velocity', value: 'lead-velocity' },
            { label: 'Net revenue retention', value: 'net-revenue-retention' },
        ]"
    />
</template>
```

## Props

- `modelValue?: string | number | Array<string | number>` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean } | { label: string; items: Array<...> }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `optionGroupLabel?: string` (default `label`)
- `optionGroupChildren?: string` (default `items`)
- `grouped?: boolean` (default `false`)
- `groupBy?: string | ((option) => string)` (default `undefined`)
- `multiple?: boolean` (default `false`)
- `removeChipLabel?: string` (default `Remove item`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `virtual?: boolean` (default `false`)
- `virtualItemHeight?: number` (default `36`)
- `virtualOverscan?: number` (default `4`)
- `virtualThreshold?: number` (default `100`)
- `loadMoreOffset?: number` (default `3`)
- `ariaLabel?: string` (default `Autocomplete input`)
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `search`
- `focus`
- `blur`
- `loadMore` (`{ query, visibleEndIndex, total }`)

## Slots

- This component does not expose named slots.

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via `theme.overrides.components.autocomplete`.

## Tokens

Override via `theme.overrides.components.autocomplete`:

- Core: `minWidth`, `fontSize`, `controlGap`, `chevronSize`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`, `focusBorderColor`, `hoverBorderColor`, `disabledOpacity`, `focusRingShadow`
- Panel/options: `panel*`, `option*`, `empty*`, `loading*`
- Multiple chips: `chipGap`, `chipPadding`, `chipRadius`, `chipBackgroundColor`, `chipTextColor`, `chipFontSize`
- Group labels: `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`, `groupLabelFontWeight`
- Size variants: `small.padding`, `small.fontSize`, `large.padding`, `large.fontSize`

## Recipes

- Use single-select for search-and-pick fields where free text is not the final value.
- Use `multiple` for compact tag-style selection, but switch to a larger pattern when chips can grow unbounded.
- Use `grouped` or `groupBy` when users need category context before they can choose an item.
- Turn on `virtual` for long lists and pair it with `loadMore` for remote pagination flows.

## Accessibility

- Input uses combobox semantics (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-autocomplete="list"`).
- Options panel uses `role="listbox"` and options use `role="option"` with selected/highlighted state sync.
- Keyboard support: `ArrowDown`/`ArrowUp` navigate, `Enter` selects highlighted option, `Escape` closes panel.
- In `multiple` mode, selected values are rendered as chips and `Backspace` removes the last chip when query is empty.
- In `readonly` mode, panel open/search interactions are blocked.
