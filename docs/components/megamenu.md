# MegaMenu

Provide multi-column navigation panels for grouped top-level product destinations.

## Import

```ts
import { MegaMenu } from '@codemonster-ru/vueforge';
```

## Examples

Use `MegaMenu` when a top-level area opens into several grouped destinations and a simple dropdown is no longer enough.

### Basic

Use grouped sections to present multiple product areas under one root trigger.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const active = ref<number | null>(null);
</script>

<template>
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
                            { label: 'Pricing', to: '/pricing' }
                        ]
                    },
                    {
                        label: 'Operations',
                        items: [{ label: 'Orders', to: '/orders' }]
                    }
                ]
            },
            {
                label: 'Docs',
                items: [{ label: 'Guides', to: '/guides' }]
            }
        ]"
    />
</template>
```

### Controlled Active Root

Control the open root explicitly when the surrounding shell owns open state.

```vue
<template>
    <MegaMenu :model-value="0" :items="items" />
</template>
```

### Lazy Root Content

Use `lazy` when a root section should load its grouped links on first open.

```vue
<template>
    <MegaMenu
        :items="[
            { label: 'Integrations', lazy: true, sections: [] }
        ]"
        @lazy-load="onLazyLoad"
    />
</template>
```

## Props

- `items?: Array<MegaMenuItem>`
- `modelValue?: number | null`
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Mega menu`)
- `syncActiveFromRoute?: boolean` (default `true`)

## Events

- `update:modelValue`
- `open`
- `close`
- `linkClick`
- `navigate`
- `lazyLoad`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.megamenu`.

## Tokens

Component tokens (override via `theme.overrides.components.megamenu`):

- `borderColor`, `borderRadius`, `backgroundColor`, `padding`
- `rootGap`
- `triggerTextColor`, `triggerPadding`, `triggerBorderRadius`, `triggerActiveBackgroundColor`
- `panelOffset`, `zIndex`, `panelMinWidth`, `panelBorderColor`, `panelBorderRadius`, `panelBackgroundColor`, `panelShadow`, `panelPadding`
- `columnsGap`
- `sectionTitleGap`, `sectionTitleFontSize`, `sectionTitleColor`
- `linkGap`, `linkColor`, `linkHoverColor`

## Recipes

- Use `MegaMenu` only when grouped navigation actually improves discovery; otherwise prefer `Menu` or `TabMenu`.
- Keep section count and link density balanced so the panel stays scannable.
- On narrow screens, switch to a drawer or simpler vertical navigation rather than forcing the mega menu pattern.

## Accessibility

- Uses a navigation landmark with root menubar semantics.
- Active triggers expose `aria-expanded` and connect to their panels via `aria-controls`.
- Keyboard support includes root traversal and `Escape` to close the open panel.
