# KanbanBoard

## Purpose

Render and manage high-density operational data with scalable interaction patterns.
Support filtering, navigation, and bulk workflows used in core SaaS backoffice screens.

## Props

- `columns?: Array<{ id: string | number; title: string }>`
- `items?: Array<{ id: string | number; columnId: string | number; title: string; description?: string; assignee?: string; priority?: 'low' | 'medium' | 'high'; tags?: string[] }>`
- `ariaLabel?: string` (default `Kanban board`)
- `emptyColumnText?: string` (default `Drop cards here`)
- `virtualization?: boolean` (default `false`)
- `virtualizationThreshold?: number` (default `40`)
- `itemHeight?: number` (default `72`)
- `swimlaneHeight?: number` (default `420`)
- `overscan?: number` (default `3`)
- `keyboardDnD?: boolean` (default `true`)

## Events

- `update:items`
- `move`
- `click`

## Slots

- `column-header` (optional) - slot props `{ column, items }`
- `card` (optional) - slot props `{ item, column, index }`
- `column-footer` (optional) - slot props `{ column, items }`
- `empty-column` (optional) - slot props `{ column }`

## Examples

```vue
<KanbanBoard v-model:items="items" :columns="columns" @move="onMove" />
```

```vue
<KanbanBoard
    v-model:items="items"
    :columns="columns"
    virtualization
    :virtualization-threshold="20"
    :item-height="56"
    :swimlane-height="420"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.kanbanBoard`):

- `gap`, `columnMinWidth`, `columnGap`
- `columnBorderColor`, `columnBorderRadius`, `columnBackgroundColor`
- `columnHeaderPadding`, `columnHeaderBorderColor`
- `columnTitleFontSize`, `columnTitleFontWeight`, `columnCountFontSize`, `columnCountColor`
- `bodyPadding`
- `cardGap`, `cardPadding`, `cardBorderRadius`, `cardBorderColor`, `cardBackgroundColor`, `cardHoverBorderColor`
- `cardTitleFontSize`, `cardTitleFontWeight`, `cardDescriptionFontSize`, `cardDescriptionColor`
- `priorityLowColor`, `priorityMediumColor`, `priorityHighColor`
- `tagGap`, `tagPadding`, `tagBorderRadius`, `tagBackgroundColor`, `tagTextColor`
- `assigneeFontSize`, `assigneeColor`
- `emptyPadding`, `emptyColor`
- `columnFooterPadding`, `columnFooterBorderColor`
- `dragOpacity`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate lane density, horizontal overflow strategy, and virtualization behavior across breakpoints.
Ensure card actions remain accessible and discoverable on touch devices.

## SSR/Hydration

Render initial viewport slice and structural wrappers deterministically to avoid hydration drift.
Defer measurement-driven virtualization logic until client mount.

## Testing

Cover keyboard DnD, drag/drop lane moves, and large-dataset virtualization edge cases.
Add performance-sensitive regression tests for swimlane scrolling and move interactions.

## Accessibility

- Keyboard DnD shortcuts:
    - `Space` or `Enter`: pick/drop focused card
    - `ArrowUp` / `ArrowDown`: reorder within lane while picked
    - `ArrowLeft` / `ArrowRight`: move to adjacent lane while picked
    - `Escape`: cancel keyboard drag mode
- Ensure visible focus state and sufficient color contrast in usage contexts.
