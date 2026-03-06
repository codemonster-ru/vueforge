# BottomNavigation

Provide mobile-first primary navigation anchored to the bottom edge of the viewport.

## Import

```ts
import { BottomNavigation } from '@codemonster-ru/vueforge';
```

## Examples

Use `BottomNavigation` for mobile shell navigation where a bottom bar is easier to reach than a sidebar.

### Basic

Use items with icons and labels for the main app destinations.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const active = ref('home');

const items = [
    { key: 'home', label: 'Home', icon: 'house' },
    { key: 'search', label: 'Search', icon: 'search' },
    { key: 'alerts', label: 'Alerts', icon: 'bell', badge: 3 },
    { key: 'profile', label: 'Profile', icon: 'user' }
];
</script>

<template>
    <BottomNavigation v-model="active" :items="items" />
</template>
```

### Icon-Only

Hide labels when space is limited and icons are already well learned by users.

```vue
<template>
    <BottomNavigation :items="items" :show-labels="false" />
</template>
```

### Non-Fixed

Disable `fixed` when the navigation should stay inside a composed layout instead of pinning to the viewport.

```vue
<template>
    <BottomNavigation :items="items" :fixed="false" />
</template>
```

## Props

- `items?: Array<BottomNavigationItem>`
- `modelValue?: string | number | null`
- `disabled?: boolean` (default `false`)
- `fixed?: boolean` (default `true`)
- `mobileOnly?: boolean` (default `true`)
- `showLabels?: boolean` (default `true`)
- `ariaLabel?: string` (default `Bottom navigation`)
- `syncActiveFromRoute?: boolean` (default `true`)

## Events

- `update:modelValue`
- `select`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.bottomNavigation`.

## Tokens

Component tokens (override via `theme.overrides.components.bottomNavigation`):

- `height`, `padding`, `gap`
- `borderColor`, `backgroundColor`, `textColor`, `zIndex`, `disabledOpacity`
- `itemMinHeight`, `itemPadding`, `itemBorderRadius`, `itemContentGap`
- `itemColor`, `itemHoverBackgroundColor`
- `itemActiveBackgroundColor`, `itemActiveColor`
- `iconSize`, `labelFontSize`
- `badgeTextColor`, `badgeBackgroundColor`

## Recipes

- Use bottom navigation for a small set of primary destinations, not long menus.
- Keep labels visible until icons are truly familiar and unambiguous.
- If route state already determines the active item, leave `modelValue` unset and use route syncing.

## Accessibility

- Uses a `nav` landmark with horizontal menubar semantics.
- Keyboard support includes `ArrowLeft`, `ArrowRight`, `Home`, `End`, `Enter`, and `Space`.
