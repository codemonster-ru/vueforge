# VirtualScroller

Render long lists efficiently by only mounting the visible slice of items inside a fixed-height viewport.

## Import

```ts
import { VirtualScroller } from '@codemonster-ru/vueforge';
```

## Examples

Use `VirtualScroller` when list size is large enough that rendering every row at once is wasteful.

### Basic

Use the default slot to render a visible slice of a long dataset.

```vue
<template>
    <VirtualScroller :items="users" :item-height="44" height="320px" key-field="id">
        <template #default="{ item, index }">
            <div>{{ index + 1 }}. {{ item.name }}</div>
        </template>
    </VirtualScroller>
</template>
```

### With Reach-End Loading

Use `reachEnd` to trigger lazy loading or pagination handoff.

```vue
<template>
    <VirtualScroller :items="activity" :item-height="52" height="28rem" :overscan="6" @reach-end="loadMore">
        <template #default="{ item }">
            <article>{{ item.message }}</article>
        </template>
    </VirtualScroller>
</template>
```

### Non-Virtual Fallback

Disable virtualization for short lists while keeping the same slot contract.

```vue
<template>
    <VirtualScroller :items="smallList" :virtual="false">
        <template #default="{ item }">
            <div>{{ item.label }}</div>
        </template>
    </VirtualScroller>
</template>
```

## Props

- `items?: Array<unknown>` (default `[]`)
- `itemHeight?: number` (default `36`)
- `height?: string` (default `18rem`)
- `overscan?: number` (default `4`)
- `keyField?: string` (default `id`)
- `virtual?: boolean` (default `true`)
- `ariaLabel?: string`
- `emptyText?: string`

## Events

- `scroll`
- `rangeChange`
- `reachEnd`

## Slots

- `default` - item content with `{ item, index }`
- `empty`

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

- Keep `itemHeight` accurate; virtualization quality depends on predictable row size.
- Use `rangeChange` or `reachEnd` for analytics, prefetching, or lazy loading.
- Fall back to `virtual=false` when the list is short or row heights are too variable.

## Accessibility

- Uses list semantics with `role="list"` and `role="listitem"`.
- Provide a descriptive `ariaLabel` when the visible list context is not already obvious.
