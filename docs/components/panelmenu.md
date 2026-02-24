# PanelMenu

## Purpose

Provide accordion-style hierarchical navigation for sidebar contexts where sections need expandable nested links.

## Props

- `items?: Array<PanelMenuItem>`
- `expandedKeys?: Array<string>` - controlled open section keys.
- `multiple?: boolean` (default `true`) - allow multiple expanded roots.
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Panel menu`)
- `syncActiveFromRoute?: boolean` (default `true`) - keep active route branch expanded.

`PanelMenuItem`:

- `key?: string`
- `label: string`
- `to?: string`
- `href?: string`
- `url?: string`
- `active?: boolean`
- `exact?: boolean`
- `disabled?: boolean`
- `lazy?: boolean`
- `loading?: boolean`
- `items?: Array<PanelMenuItem>`

## Events

- `update:expandedKeys`
- `toggle`
- `itemClick`
- `lazyLoad` (`{ key, item }`) - emitted when opening lazy node without loaded children.

## Slots

- N/A (baseline tree/accordion renderer).

## Examples

```vue
<PanelMenu
    v-model:expandedKeys="expanded"
    :items="[
        { key: 'products', label: 'Products', items: [{ key: 'catalog', label: 'Catalog', to: '/catalog' }] },
        { key: 'docs', label: 'Docs', items: [{ key: 'guides', label: 'Guides', to: '/guides' }] },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.panelmenu`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `padding`
- `gap`, `indent`
- `itemTextColor`, `itemBorderRadius`, `itemPadding`, `itemHoverBackgroundColor`

## Recipes

- Use with app shell sidebars to collapse deep navigation into scannable sections.
- In dense sidebars, set `multiple=false` to keep only one expanded section at a time.

## Accessibility

- Root renders a `nav` landmark and internal `tree/group/treeitem` semantics.
- Expandable rows expose `aria-expanded` + `aria-controls`; keyboard toggling supports `Enter`/`Space`.
- Active route links/branches receive active styling and leaf links expose `aria-current="page"`.

## Responsive

- On small widths, pair with drawer container and keep section labels short.
- Keep nested depth shallow to avoid excessive horizontal indent.

## SSR/Hydration

- Expansion state is deterministic from `expandedKeys`; hydration-safe with no client-only rendering branches.

## Testing

- Cover expand/collapse behavior, single-open mode, leaf click events, and keyboard toggle behavior.
- Cover route-driven expansion sync and `lazyLoad` handoff for deferred tree branches.
