# KanbanBoard

## Props

- `columns?: Array<{ id: string | number; title: string }>`
- `items?: Array<{ id: string | number; columnId: string | number; title: string; description?: string; assignee?: string; priority?: 'low' | 'medium' | 'high'; tags?: string[] }>`
- `ariaLabel?: string` (default `Kanban board`)
- `emptyColumnText?: string` (default `Drop cards here`)

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

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
