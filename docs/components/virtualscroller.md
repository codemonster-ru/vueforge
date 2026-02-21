# VirtualScroller

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

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
