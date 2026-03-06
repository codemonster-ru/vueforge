# DataTableToolbar

Provide a unified control surface for table search, filters, presets, density, and export actions.

## Import

```ts
import { DataTableToolbar } from '@codemonster-ru/vueforge';
```

## Examples

Use `DataTableToolbar` above `DataTable` when a list page needs one compact row of controls.

### Basic

Use search and filter count for a standard operational list page.

```vue
<template>
    <DataTableToolbar
        :search="search"
        :filter-count="activeFiltersCount"
        @update:search="search = $event"
        @filters-click="showFilters = true"
    />
</template>
```

### With Presets And Export

Use presets, density, and export actions for heavier backoffice screens.

```vue
<template>
    <DataTableToolbar
        :search="search"
        :column-presets="columnPresetOptions"
        :export-options="[
            { id: 'csv', label: 'CSV' },
            { id: 'xlsx', label: 'Excel' }
        ]"
        density="compact"
        @update:search="search = $event"
        @filters-click="showFilters = true"
        @export="startExport"
    />
</template>
```

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

## Theming

- Override via `theme.overrides.components.dataTableToolbar`.

## Tokens

Component tokens (override via `theme.overrides.components.dataTableToolbar`):

- `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- `rowGap`, `labelFontSize`
- `controlHeight`, `controlBorderColor`, `controlBorderRadius`, `controlBackgroundColor`
- `badgeBackgroundColor`, `badgeTextColor`
- `focusBorderColor`, `focusRing`
- `disabledOpacity`

## Recipes

- Keep the toolbar focused on table-level controls, not row-level actions.
- Use filter count as a summary cue rather than listing every active filter inline.
- Pair it with route-synced table state if search and preset choices should survive reloads.

## Accessibility

- Root uses `role="region"` with configurable `ariaLabel`.
- Search, selects, and buttons use native form controls for keyboard compatibility.
