# AdvancedFilterPanel

## Purpose

Compose structured field filters with optional nested query rules and reusable presets.
Provides URL-sync-friendly state serialization for list pages and backoffice search screens.

## Props

- `modelValue?: AdvancedFilterPanelState | null` (v-model)
- `fields?: Array<{ key: string; label: string; type?: 'text' | 'number' | 'boolean' | 'select' | 'date'; placeholder?: string; options?: Array<{ label: string; value: string | number | boolean }>; defaultValue?: unknown }>`
- `queryBuilderFields?: Array<QueryBuilderField>`
- `presets?: Array<{ id: string; label: string; state: Partial<AdvancedFilterPanelState> }>`
- `disabled?: boolean` (default `false`)
- `showQueryBuilder?: boolean` (default `true`)
- `ariaLabel?: string` (default `Advanced filter panel`)
- `presetLabel?: string` (default `Preset`)
- `noPresetLabel?: string` (default `Custom`)
- `applyLabel?: string` (default `Apply`)
- `resetLabel?: string` (default `Reset`)

## Events

- `update:modelValue`
- `change`
- `apply`
- `reset`
- `presetChange`

## Slots

- This component does not expose named slots.

## Exposed Methods

- `serializeToQueryParams(): string`
- `deserializeFromQueryParams(queryString: string): boolean`
- `applyState()`
- `resetState()`

## Examples

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
    :presets="savedPresets"
    @apply="fetchDataWithFilters"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.advancedFilterPanel`):

- `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- `rowGap`, `labelFontSize`
- `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- `focusBorderColor`, `focusRing`
- `disabledOpacity`

## Accessibility

- Root uses `role="region"` with configurable `ariaLabel`.
- Built from native inputs/selects/buttons for keyboard compatibility.
- Keep field labels aligned with backend filter semantics for clear screen-reader narration.
