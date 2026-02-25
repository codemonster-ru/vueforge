# DataTableToolbar

## Purpose

Provide a unified table control surface for search, filters, column presets, density, and export actions.
Designed for SaaS list pages and operational grids with server/client data workflows.

## Props

- `search?: string` (default `''`)
- `filterCount?: number` (default `0`)
- `columnPreset?: string | null` (default `null`)
- `columnPresets?: Array<{ id: string; label: string; disabled?: boolean }>`
- `density?: 'comfortable' | 'compact' | 'spacious'` (default `comfortable`)
- `exportOptions?: Array<{ id: string; label: string; disabled?: boolean }>`
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Data table toolbar`)
- `searchLabel?: string` (default `Search`)
- `searchPlaceholder?: string` (default `Search rows`)
- `filtersLabel?: string` (default `Filters`)
- `columnsLabel?: string` (default `Columns`)
- `noPresetLabel?: string` (default `Default`)
- `densityLabel?: string` (default `Density`)
- `comfortableLabel?: string` (default `Comfortable`)
- `compactLabel?: string` (default `Compact`)
- `spaciousLabel?: string` (default `Spacious`)
- `exportLabel?: string` (default `Export`)
- `exportActionLabel?: string` (default `Export as`)

## Events

- `update:search`
- `search`
- `filtersClick`
- `update:columnPreset`
- `columnPresetChange`
- `update:density`
- `densityChange`
- `export`

## Slots

- This component does not expose named slots.

## Examples

```vue
<DataTableToolbar
    :search="search"
    :filter-count="activeFiltersCount"
    :column-presets="columnPresetOptions"
    :export-options="[
        { id: 'csv', label: 'CSV' },
        { id: 'xlsx', label: 'Excel' },
    ]"
    @update:search="search = $event"
    @filters-click="showFilters = true"
    @export="startExport"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.dataTableToolbar`):

- `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- `rowGap`, `labelFontSize`
- `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- `badgeBackgroundColor`, `badgeTextColor`
- `focusBorderColor`, `focusRing`
- `disabledOpacity`

## Accessibility

- Root uses `role="region"` with configurable `ariaLabel`.
- Search, selectors, and actions use native controls for keyboard compatibility.
- Keep export labels explicit (for example `CSV`, `Excel`) for clearer assistive announcements.
