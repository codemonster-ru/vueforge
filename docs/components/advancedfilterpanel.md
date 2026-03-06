# AdvancedFilterPanel

AdvancedFilterPanel combines field-level filters, optional query-builder logic, and reusable presets for admin search screens.

## Import

```ts
import AdvancedFilterPanel from '@/package/components/advanced-filter-panel.vue';
```

## Examples

### Basic

Use `AdvancedFilterPanel` when a list page needs both simple field filters and structured rule logic.

```vue
<AdvancedFilterPanel
    v-model="filters"
    :fields="[
        { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Open', value: 'open' }] },
        { key: 'priority', label: 'Priority', type: 'number' },
    ]"
    :query-builder-fields="[
        { key: 'assignee', label: 'Assignee', type: 'text' },
        { key: 'severity', label: 'Severity', type: 'number' },
    ]"
    @apply="fetchDataWithFilters"
/>
```

### Presets

Use presets for common operational views like "Assigned to me" or "Failed jobs".

```vue
<AdvancedFilterPanel
    v-model="filters"
    :fields="fields"
    :presets="savedPresets"
    @preset-change="onPresetChange"
/>
```

### Field-Only Mode

Disable the query builder when the page should stay limited to direct field controls.

```vue
<AdvancedFilterPanel
    v-model="filters"
    :fields="fields"
    :show-query-builder="false"
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `AdvancedFilterPanelState \| null` | `null` |
| `fields` | `AdvancedFilterField[]` | `[]` |
| `queryBuilderFields` | `AdvancedFilterPanelQueryBuilderField[]` | `[]` |
| `presets` | `AdvancedFilterPreset[]` | `[]` |
| `disabled` | `boolean` | `false` |
| `showQueryBuilder` | `boolean` | `true` |
| `ariaLabel` | `string` | `'Advanced filter panel'` |
| `presetLabel` | `string` | `'Preset'` |
| `noPresetLabel` | `string` | `'Custom'` |
| `applyLabel` | `string` | `'Apply'` |
| `resetLabel` | `string` | `'Reset'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `AdvancedFilterPanelState` |
| `change` | `AdvancedFilterPanelState` |
| `apply` | `AdvancedFilterPanelState` |
| `reset` | `AdvancedFilterPanelState` |
| `presetChange` | `(presetId, state)` |

### Exposed Methods

| Name | Description |
| --- | --- |
| `serializeToQueryParams()` | Serializes current state into a query string. |
| `deserializeFromQueryParams(queryString)` | Applies serialized state and returns success. |
| `applyState()` | Emits the current state through `apply`. |
| `resetState()` | Resets to default state and emits updates. |

## Theming

Override component tokens through `theme.overrides.components.advancedFilterPanel`.

## Tokens

- Surface: `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- Form layout: `rowGap`, `labelFontSize`
- Controls: `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- States: `focusBorderColor`, `focusRing`, `disabledOpacity`

## Recipes

- Use field filters for common cases and reserve the query builder for advanced narrowing, not as the only filter entry point.
- Keep preset labels task-oriented so operators can recognize them without opening the underlying rule tree.

## Accessibility

- The root uses `role="region"` with a configurable `ariaLabel`.
- Native inputs, selects, and buttons keep keyboard behavior predictable.
