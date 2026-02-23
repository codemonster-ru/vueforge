# MegaMenu

## Purpose

Provide multi-column navigation content for product areas that need richer grouped links than a simple dropdown menu.

## Props

- `items?: Array<MegaMenuItem>`
- `modelValue?: number | null` - active top-level item index.
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Mega menu`)

`MegaMenuItem`:

- `label: string`
- `disabled?: boolean`
- `sections?: Array<{ label?: string; items: Array<{ label: string; to?: string; href?: string; disabled?: boolean }> }>`
- `items?: Array<{ label: string; to?: string; href?: string; disabled?: boolean }>` (single-section shortcut)

## Events

- `update:modelValue`
- `open`
- `close`
- `linkClick`

## Slots

- N/A (baseline API renders structured sections and links).

## Examples

```vue
<MegaMenu
    v-model="active"
    :items="[
        {
            label: 'Products',
            sections: [
                {
                    label: 'Commerce',
                    items: [
                        { label: 'Catalog', to: '/catalog' },
                        { label: 'Pricing', to: '/pricing' },
                    ],
                },
                { label: 'Operations', items: [{ label: 'Orders', to: '/orders' }] },
            ],
        },
        { label: 'Docs', items: [{ label: 'Guides', to: '/guides' }] },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.megamenu`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `padding`
- `rootGap`
- `triggerTextColor`, `triggerPadding`, `triggerBorderRadius`, `triggerActiveBackgroundColor`
- `panelOffset`, `zIndex`, `panelMinWidth`, `panelBorderColor`, `panelBorderRadius`, `panelBackgroundColor`, `panelShadow`, `panelPadding`
- `columnsGap`
- `sectionTitleGap`, `sectionTitleFontSize`, `sectionTitleColor`
- `linkGap`, `linkColor`, `linkHoverColor`

## Recipes

- Use for top navigation where each product area has multiple grouped destinations.
- Keep section count and link density balanced to avoid oversized dropdown panels.

## Accessibility

- Uses `nav` landmark and root `menubar` semantics with `menuitem` triggers.
- Active triggers expose `aria-expanded` and connect to panel via `aria-controls`.
- Keyboard supports `Enter`/`Space` toggle, `ArrowLeft`/`ArrowRight` item traversal, and `Escape` close.

## Responsive

- For narrow screens, collapse into drawer or simpler vertical menu patterns.
- Limit panel width and section count to prevent horizontal overflow.

## SSR/Hydration

- Hydration-safe controlled state via `modelValue`; no direct DOM-only branching in setup.

## Testing

- Cover trigger open/close, multi-column rendering, keyboard traversal, and link-click close behavior.
