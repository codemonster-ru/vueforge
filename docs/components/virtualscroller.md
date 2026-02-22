# VirtualScroller

## Purpose

Render and manage high-density operational data with scalable interaction patterns.
Support filtering, navigation, and bulk workflows used in core SaaS backoffice screens.

## Props

- `items?: Array<unknown>` (default `[]`)
- `itemHeight?: number` (default `36`)
- `height?: string` (default `18rem`)
- `overscan?: number` (default `4`)
- `keyField?: string` (default `id`)
- `virtual?: boolean` (default `true`)
- `ariaLabel?: string` (default `Virtual list`)
- `emptyText?: string` (default `No items`)

## Events

- `scroll`
- `rangeChange` (payload: `{ start: number; end: number }`)
- `reachEnd`

## Slots

- `default` - item content with slot props `{ item, index }`
- `empty` - empty state content

## Examples

```vue
<VirtualScroller :items="users" :item-height="44" height="320px" :overscan="6" key-field="id">
    <template #default="{ item, index }">
        <div>{{ index + 1 }}. {{ item.name }}</div>
    </template>
</VirtualScroller>
```

## Theming

- Override via `theme.overrides.components.virtualScroller`.

## Tokens

Component tokens (override via `theme.overrides.components.virtualScroller`):

- `fontSize`
- `borderColor`, `borderRadius`
- `backgroundColor`, `textColor`
- `focusRingShadow`
- `itemPadding`, `itemBorderColor`
- `emptyPadding`, `emptyColor`

## Recipes

- Long activity feed with virtualized rows and fixed `itemHeight`.
- Command/search results list with `reachEnd` to trigger lazy loading.
- Non-virtual fallback mode (`virtual=false`) for short lists.

## Responsive

Validate table/list density, horizontal overflow strategy, and virtualization behavior across breakpoints.
Ensure row/item actions remain accessible and discoverable on touch devices.

## SSR/Hydration

Render initial viewport slice and structural wrappers deterministically to avoid hydration drift.
Defer measurement-driven virtualization logic until client mount.

## Testing

Cover sorting/filtering/selection/navigation flows and large-dataset edge cases.
Add performance-sensitive regression tests and ARIA verification for interactive data regions.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
