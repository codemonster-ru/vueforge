# FilterChips

FilterChips renders compact toggleable chips for single or multiple filter state.

## Import

```ts
import FilterChips from '@/package/components/filter-chips.vue';
```

## Examples

### Basic

```vue
<FilterChips
    v-model="activeFilters"
    :options="[
        { label: 'Open', value: 'open', count: 12 },
        { label: 'In progress', value: 'progress', count: 7 },
        { label: 'Done', value: 'done', count: 18 },
    ]"
    clearable
/>
```

### Single-Select

```vue
<FilterChips
    v-model="activeStatus"
    :options="statusOptions"
    :multiple="false"
    :allow-empty="false"
    variant="outline"
/>
```

### Dense Toolbar Filters

```vue
<FilterChips v-model="activeFilters" :options="statusOptions" size="small" :wrap="false" />
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| number \| Array<string \| number> \| null` | `null` |
| `options` | option array | `[]` |
| `multiple` | `boolean` | `true` |
| `allowEmpty` | `boolean` | `true` |
| `clearable` | `boolean` | `false` |
| `clearText` | `string \| undefined` | `undefined` |
| `clearLabel` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `wrap` | `boolean` | `true` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |
| `variant` | `'soft' \| 'outline' \| 'solid'` | `'soft'` |
| `ariaLabel` | `string` | `''` |
| `ariaLabelledby` | `string` | `''` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | selection payload |
| `change` | `selection, event` |
| `clear` | `MouseEvent` |

## Theming

Override component tokens through `theme.overrides.components.filterChips`.

## Tokens

- Layout: `fontSize`, `gap`, `chipGap`, `chipPadding`, `chipBorderRadius`
- Chip states: `chipBorderColor`, `chipBackgroundColor`, `chipTextColor`, `chipHoverBackgroundColor`, `chipHoverBorderColor`, `chipActiveBackgroundColor`, `chipActiveBorderColor`, `chipActiveTextColor`, `chipSolidActiveBackgroundColor`, `chipSolidActiveBorderColor`, `chipSolidActiveTextColor`
- Count badge: `countPadding`, `countFontSize`, `countBackgroundColor`, `countTextColor`, `countActiveBackgroundColor`, `countActiveTextColor`
- State and sizes: `disabledOpacity`, `small.*`, `large.*`

## Recipes

- Use FilterChips for result filters, status toggles, and dense toolbar facets.
- Prefer `SegmentedControl` when the interaction is strictly single-select and the options need stronger button-like affordance.

## Accessibility

- Chips are native buttons with `aria-pressed` and grouped through `role="group"`.
- The clear button should use explicit text when the filter meaning is not obvious from nearby context.

