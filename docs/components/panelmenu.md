# PanelMenu

Provide accordion-style hierarchical navigation for sidebars and dense navigation columns.

## Import

```ts
import { PanelMenu } from '@codemonster-ru/vueforge';
```

## Examples

Use `PanelMenu` when a sidebar needs collapsible navigation sections rather than a flat list.

### Basic

Use expanded keys to control which root sections stay open.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const expanded = ref(['products']);
</script>

<template>
    <PanelMenu
        v-model:expandedKeys="expanded"
        :items="[
            {
                key: 'products',
                label: 'Products',
                items: [{ key: 'catalog', label: 'Catalog', to: '/catalog' }]
            },
            {
                key: 'docs',
                label: 'Docs',
                items: [{ key: 'guides', label: 'Guides', to: '/guides' }]
            }
        ]"
    />
</template>
```

### Single Open Section

Set `multiple="false"` when only one section should stay expanded at a time.

```vue
<template>
    <PanelMenu :items="items" :expanded-keys="['analytics']" :multiple="false" />
</template>
```

### Lazy Branch

Use `lazy` when nested items are loaded on demand.

```vue
<template>
    <PanelMenu
        :items="[
            { key: 'reports', label: 'Reports', lazy: true, items: [] }
        ]"
        @lazy-load="onLazyLoad"
    />
</template>
```

## Props

- `items?: Array<PanelMenuItem>`
- `expandedKeys?: Array<string>`
- `multiple?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Panel menu`)
- `syncActiveFromRoute?: boolean` (default `true`)

## Events

- `update:expandedKeys`
- `toggle`
- `itemClick`
- `lazyLoad`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.panelmenu`.

## Tokens

Component tokens (override via `theme.overrides.components.panelmenu`):

- `borderColor`, `borderRadius`, `backgroundColor`, `padding`
- `gap`, `indent`, `groupPadding`
- `itemTextColor`, `itemFontSize`, `itemFontWeight`
- `itemBorderRadius`, `itemPadding`, `itemHoverBackgroundColor`
- `itemActiveTextColor`, `itemActiveBackgroundColor`, `itemActiveFontWeight`
- `triggerActiveTextColor`, `triggerActiveBackgroundColor`, `triggerActiveFontWeight`
- `linkActiveTextColor`, `linkActiveBackgroundColor`, `linkActiveFontWeight`
- `chevronSize`

## Recipes

- Use `PanelMenu` for nested sidebar navigation that should remain compact and scannable.
- Set `multiple=false` in dense sidebars to reduce visual noise from too many open branches.
- Keep nesting shallow; if the tree becomes too deep, a different navigation pattern is usually better.

## Accessibility

- Root renders a navigation landmark with tree semantics.
- Expandable items expose `aria-expanded` and keyboard toggling.
- Active leaf links expose `aria-current="page"` when route syncing is enabled.
