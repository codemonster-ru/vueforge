# QueryBuilder

## Purpose

Build nested filter expressions for list/report endpoints with explicit `AND/OR` group logic.
Supports rule editing, nested groups, and stable JSON serialization for URL/API handoff.

## Props

- `modelValue?: QueryBuilderGroupNode | null` (v-model)
- `fields?: Array<{ key: string; label: string; type?: 'text' | 'number' | 'date' | 'boolean' | 'select'; operators?: string[]; options?: Array<{ label: string; value: string | number | boolean }> }>`
- `maxDepth?: number` (default `5`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Query builder`)
- `andLabel?: string` (default `AND`)
- `orLabel?: string` (default `OR`)
- `addRuleLabel?: string` (default `+ Rule`)
- `addGroupLabel?: string` (default `+ Group`)
- `removeRuleLabel?: string` (default `Remove`)
- `removeGroupLabel?: string` (default `Remove group`)
- `combinatorLabel?: string` (default `Match`)

## Events

- `update:modelValue`
- `change`

## Slots

- This component does not expose named slots.

## Exposed Methods

- `serialize(): string` - returns JSON string of current group tree.
- `deserialize(payload: string): boolean` - applies JSON model and emits updates (`false` for invalid payload).
- `getModel(): QueryBuilderGroupNode` - returns cloned current model.

## Examples

```vue
<QueryBuilder
    v-model="filters"
    :fields="[
        { key: 'status', label: 'Status', type: 'select', options: [{ label: 'Open', value: 'open' }] },
        { key: 'priority', label: 'Priority', type: 'number' },
        { key: 'assignee', label: 'Assignee', type: 'text' },
    ]"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.queryBuilder`):

- `fontSize`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `secondaryTextColor`
- `rowGap`, `nestedOffset`
- `groupGap`, `groupPadding`, `groupBorderRadius`, `groupBorderColor`, `groupBackgroundColor`
- `controlHeight`, `controlBorderRadius`, `controlBorderColor`, `controlBackgroundColor`
- `controlFocusBorderColor`, `controlFocusRing`
- `dangerTextColor`, `dangerBorderColor`
- `disabledOpacity`

## Accessibility

- Root container uses `role="group"` with configurable `ariaLabel`.
- Controls are native form elements (`button`, `select`, `input`) for keyboard support.
- Ensure field labels and value semantics match backend filtering contracts for screen-reader clarity.
