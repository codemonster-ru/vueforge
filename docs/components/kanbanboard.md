# KanbanBoard

KanbanBoard renders draggable lane-based work items with keyboard drag and drop, optional virtualization, and customizable column and card templates.

## Import

```ts
import KanbanBoard from '@/package/components/kanban-board.vue';
```

## Examples

### Basic

Use `v-model:items` to let the board emit reordered cards after moves.

```vue
<KanbanBoard v-model:items="items" :columns="columns" @move="onMove" />
```

### Virtualized Lanes

Enable virtualization for tall lanes with many cards.

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

### Custom Card Content

Use the `card` slot when the board needs richer cards than the built-in title, description, tags, and assignee layout.

```vue
<KanbanBoard v-model:items="items" :columns="columns">
    <template #card="{ item }">
        <article class="task-card">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
            <StatusBadge :severity="item.priority" />
        </article>
    </template>
</KanbanBoard>
```

### Custom Headers And Footers

Use header and footer slots for lane-level controls or metrics.

```vue
<KanbanBoard v-model:items="items" :columns="columns">
    <template #column-header="{ column, items }">
        <Inline gap="sm">
            <h3>{{ column.title }}</h3>
            <Badge :value="items.length" />
        </Inline>
    </template>
</KanbanBoard>
```

## API

### Types

```ts
type KanbanId = string | number;
type KanbanPriority = 'low' | 'medium' | 'high';

interface KanbanColumn {
    id: KanbanId;
    title: string;
}

interface KanbanBoardItem {
    id: KanbanId;
    columnId: KanbanId;
    title: string;
    description?: string;
    assignee?: string;
    priority?: KanbanPriority;
    tags?: string[];
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `columns` | `KanbanColumn[]` | `[]` |
| `items` | `KanbanBoardItem[]` | `[]` |
| `ariaLabel` | `string` | `'Kanban board'` |
| `emptyColumnText` | `string` | `'Drop cards here'` |
| `virtualization` | `boolean` | `false` |
| `virtualizationThreshold` | `number` | `40` |
| `itemHeight` | `number` | `72` |
| `swimlaneHeight` | `number` | `420` |
| `overscan` | `number` | `3` |
| `keyboardDnD` | `boolean` | `true` |

### Events

| Name | Payload |
| --- | --- |
| `update:items` | updated items array |
| `move` | `item, fromColumnId, toColumnId` |
| `click` | card item |

### Slots

| Name | Description |
| --- | --- |
| `column-header` | `{ column, items }` |
| `card` | `{ item, column, index }` |
| `column-footer` | `{ column, items }` |
| `empty-column` | `{ column }` |

## Theming

Override component tokens through `theme.overrides.components.kanbanBoard`.

## Tokens

- Columns: `gap`, `columnMinWidth`, `columnGap`, `columnBorderColor`, `columnBorderRadius`, `columnBackgroundColor`, `columnHeaderPadding`, `columnHeaderBorderColor`, `columnTitleFontSize`, `columnTitleFontWeight`, `columnCountFontSize`, `columnCountColor`, `bodyPadding`, `columnFooterPadding`, `columnFooterBorderColor`
- Cards: `cardGap`, `cardPadding`, `cardBorderRadius`, `cardBorderColor`, `cardBackgroundColor`, `cardHoverBorderColor`, `cardTitleFontSize`, `cardTitleFontWeight`, `cardDescriptionFontSize`, `cardDescriptionColor`
- Priority and metadata: `priorityLowColor`, `priorityMediumColor`, `priorityHighColor`, `tagGap`, `tagPadding`, `tagBorderRadius`, `tagBackgroundColor`, `tagTextColor`, `assigneeFontSize`, `assigneeColor`
- Empty and drag state: `emptyPadding`, `emptyColor`, `dragOpacity`

## Recipes

- Use KanbanBoard for task planning, pipeline stages, support triage, and any lane-based status workflow.
- Keep `keyboardDnD` enabled unless your product has a stricter custom accessibility contract.

## Accessibility

- Keyboard drag and drop supports pick and drop with `Space` or `Enter`, lane movement with arrow keys, and cancel with `Escape`.
- Virtualized lanes preserve the board interaction model while reducing DOM size for long columns.
