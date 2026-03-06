# Pagination

Navigate paged result sets with explicit previous, next, and numbered page controls.

## Import

```ts
import { Pagination } from '@codemonster-ru/vueforge';
```

## Examples

Use `Pagination` when a large result set is chunked into pages rather than infinite scrolling.

### Basic

Use `totalItems` and `pageSize` for straightforward client or API-backed paging.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const page = ref(3);
</script>

<template>
    <Pagination v-model="page" :total-items="240" :page-size="20" />
</template>
```

### With Explicit Total Pages

Use `totalPages` when the API already gives you page count directly.

```vue
<template>
    <Pagination :model-value="2" :total-pages="12" />
</template>
```

### Dense Footer

Use the small size in table footers and compact admin layouts.

```vue
<template>
    <Pagination :model-value="5" :total-items="480" :page-size="25" size="small" />
</template>
```

### Outlined Variant

Use `outlined` on filled panels or dashboards.

```vue
<template>
    <Pagination :model-value="4" :total-pages="16" variant="outlined" />
</template>
```

## Props

- `modelValue?: number` (v-model, default `1`)
- `totalItems?: number` (default `0`)
- `pageSize?: number` (default `10`)
- `totalPages?: number` (optional override instead of `totalItems / pageSize`)
- `siblingCount?: number` (default `1`)
- `boundaryCount?: number` (default `1`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `prevLabel?: string` (default `Prev`)
- `nextLabel?: string` (default `Next`)
- `ellipsisLabel?: string` (default `...`)

## Events

- `update:modelValue`
- `change`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.pagination`.

## Tokens

Component tokens (override via `theme.overrides.components.pagination`):

- `gap`, `itemMinWidth`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `hoverBackgroundColor`
- `activeBorderColor`, `activeBackgroundColor`, `activeTextColor`
- `focusBorderColor`, `focusRingShadow`
- `disabledOpacity`, `ellipsisPadding`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Use `totalPages` only when the backend already resolves page count; otherwise prefer `totalItems` and `pageSize`.
- Keep the current page synchronized with route query state for filterable list pages.
- Reduce sibling and boundary counts in dense layouts where width is constrained.

## Accessibility

- Uses navigation semantics via `<nav aria-label="Pagination">`.
- Current page is exposed through `aria-current="page"`.
- Previous and next controls are disabled automatically at the bounds.
