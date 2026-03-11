# NavigationRail

Provide compact side navigation for application shells with optional collapsed mode.

## Import

```ts
import { NavigationRail } from '@codemonster-ru/vueforge-layouts';
```

## Examples

Use `NavigationRail` when the primary navigation should stay visible but consume less space than a full sidebar.

### Basic

Use items with icons and labels for app-level destinations.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const activeKey = ref('overview');
const collapsed = ref(false);

const railItems = [
    { key: 'overview', label: 'Overview', icon: 'house' },
    { key: 'deployments', label: 'Deployments', icon: 'rocket' },
    { key: 'logs', label: 'Logs', icon: 'list' },
    { key: 'settings', label: 'Settings', icon: 'gear' },
];
</script>

<template>
    <NavigationRail v-model="activeKey" v-model:collapsed="collapsed" :items="railItems" />
</template>
```

### With Header And Footer

Use the header and footer slots for logo, tenant context, or secondary actions.

```vue
<template>
    <NavigationRail :items="railItems">
        <template #header="{ collapsed }">
            <strong>{{ collapsed ? 'WF' : 'VueForge' }}</strong>
        </template>
        <template #footer>
            <Button size="small" variant="text">Help</Button>
        </template>
    </NavigationRail>
</template>
```

### Right Side

Switch `side` when the rail belongs on the opposite edge in a specific shell composition.

```vue
<template>
    <NavigationRail :items="railItems" side="right" />
</template>
```

## Props

- `items?: Array<NavigationRailItem>`
- `modelValue?: string | number | null`
- `collapsed?: boolean` (default `false`)
- `side?: 'left' | 'right'` (default `left`)
- `disabled?: boolean` (default `false`)
- `showToggle?: boolean` (default `true`)
- `ariaLabel?: string` (default `Primary navigation`)
- `collapseLabel?: string` (default `Collapse navigation`)
- `expandLabel?: string` (default `Expand navigation`)
- `collapseIcon?: string` (default `chevronLeft`)
- `expandIcon?: string` (default `chevronRight`)
- `syncActiveFromRoute?: boolean` (default `true`)

## Events

- `update:modelValue`
- `update:collapsed`
- `select`
- `toggle`

## Slots

- `header` with `{ collapsed, toggle }`
- `item` with `{ item, index, active, collapsed }`
- `footer` with `{ collapsed, toggle }`

## Theming

- Override via `theme.overrides.components.navigationRail`.

## Tokens

Component tokens (override via `theme.overrides.components.navigationRail`):

- `width`, `collapsedWidth`, `padding`, `gap`
- `borderColor`, `backgroundColor`, `textColor`, `disabledOpacity`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`
- `itemMinHeight`, `itemPadding`, `collapsedItemPadding`, `itemBorderRadius`
- `itemGap`, `itemContentGap`, `itemColor`, `itemHoverBackgroundColor`
- `itemActiveBackgroundColor`, `itemActiveColor`
- `iconSize`, `labelFontSize`

## Recipes

- Use `collapsed` mode when the layout must preserve more room for main content without hiding navigation entirely.
- Prefer route syncing when the current page already maps cleanly to destination items.
- Use `NavigationRail` inside `AppShell`; use `Menu` or `Tree` for deeper nested navigation structures.

## Accessibility

- Uses a `nav` landmark with vertical menu semantics.
- Keyboard support includes arrow navigation, `Home`, `End`, `Enter`, and `Space`.
