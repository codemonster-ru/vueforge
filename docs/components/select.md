# Select

Pick a single option from a controlled list with native-feeling trigger and popup behavior.

## Import

```ts
import { Select } from '@codemonster-ru/vueforge';
```

## Examples

Use `Select` when the final value must come from a fixed list and there is no need for free-text search.

### Basic

Use a basic select for compact forms and settings panels with a short option list.

```vue
<template>
    <Select
        v-model="role"
        placeholder="Choose a role"
        :options="[
            { label: 'Viewer', value: 'viewer' },
            { label: 'Editor', value: 'editor' },
            { label: 'Admin', value: 'admin' }
        ]"
    />
</template>
```

### Clearable

Turn on `clearable` when the field can intentionally return to an empty state.

```vue
<template>
    <Select
        v-model="owner"
        clearable
        placeholder="No owner"
        :options="[
            { label: 'Ava Patel', value: 'ava' },
            { label: 'Maksim Ivanov', value: 'maksim' },
            { label: 'Wei Chen', value: 'wei' }
        ]"
    />
</template>
```

### Disabled And Readonly

Use `disabled` for unavailable controls and `readonly` when the current selection should remain visible but locked.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Select
            v-model="disabledState"
            disabled
            placeholder="Disabled select"
            :options="[{ label: 'Billing', value: 'billing' }]"
        />
        <Select
            v-model="readonlyState"
            readonly
            :options="[
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' }
            ]"
        />
    </div>
</template>
```

### Loading And Empty

Use loading and empty states explicitly in async flows so the dropdown never appears broken.

```vue
<template>
    <div style="display: grid; gap: 0.75rem;">
        <Select v-model="loadingValue" loading loading-text="Loading projects..." :options="[]" />
        <Select v-model="emptyValue" empty-text="No matching environments" :options="[]" />
    </div>
</template>
```

### Virtualized Lists

Enable virtualization when the list is long enough to justify rendering only the visible options.

```vue
<template>
    <Select
        v-model="metric"
        virtual
        :virtual-threshold="5"
        :virtual-item-height="36"
        placeholder="Choose a metric"
        :options="[
            { label: 'Activation rate', value: 'activation-rate' },
            { label: 'Average order value', value: 'average-order-value' },
            { label: 'Bounce rate', value: 'bounce-rate' },
            { label: 'Churn risk', value: 'churn-risk' },
            { label: 'Expansion MRR', value: 'expansion-mrr' },
            { label: 'Gross margin', value: 'gross-margin' },
            { label: 'Lead velocity', value: 'lead-velocity' },
            { label: 'Net revenue retention', value: 'net-revenue-retention' }
        ]"
    />
</template>
```

## Props

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `clearLabel?: string` (default `Clear selection`)
- `ariaLabel?: string` (default `Select option`)
- `panelAriaLabel?: string` (default `Options`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default locale `common.loadingText`)
- `emptyText?: string` (default locale `common.emptyText`)
- `virtual?: boolean` (default `false`)
- `virtualItemHeight?: number` (default `36`)
- `virtualOverscan?: number` (default `4`)
- `virtualThreshold?: number` (default `100`)
- `loadMoreOffset?: number` (default `3`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`
- `loadMore` (`{ visibleEndIndex, total }`)

## Slots

- This component does not expose named slots.

More recipes: [`Selection Patterns`](selection-patterns.md).

## Theming

- Override via `theme.overrides.components.select`.

## Tokens

Override via `theme.overrides.components.select`:

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `focusBorderColor`, `hoverBorderColor`, `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `focusRingShadow`, `optionPadding`, `optionBorderRadius`, `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`
- `small.padding`, `small.fontSize`
- `large.padding`, `large.fontSize`

## Recipes

- Use `Select` instead of `Autocomplete` when the user is choosing from a short, mostly known list.
- Turn on `clearable` only when an empty selection is a valid and common state.
- For large remote lists, combine `virtual` with `loadMore` and stable option values.

## Accessibility

- Trigger exposes popup semantics via `aria-expanded`, `aria-controls`, and `aria-haspopup="listbox"`.
- Keyboard support: `ArrowDown`/`ArrowUp` open and navigate options, `Enter`/`Space` select, `Escape` closes.
- Options are exposed as `role="option"` within `role="listbox"` panel and sync selected state via `aria-selected`.
- `clearable` renders a keyboard-accessible clear button for resetting selection.
- In `readonly` mode, open/select/clear interactions are blocked.
