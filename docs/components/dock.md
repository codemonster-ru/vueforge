# Dock

Dock provides app-launcher style navigation for primary workspaces and utility destinations in desktop-like shells.

## Import

```ts
import { Dock } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use Dock for a compact launcher with explicit active state.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const activeKey = ref('home');
const items = [
    { key: 'home', label: 'Home', icon: 'house', to: '/home' },
    { key: 'search', label: 'Search', icon: 'magnifyingGlass', to: '/search' },
    { key: 'settings', label: 'Settings', icon: 'gear' },
];
</script>

<template>
    <Dock v-model="activeKey" :items="items" />
</template>
```

### Vertical Positions

Switch to `left` or `right` when the dock belongs to a dense desktop-style shell.

```vue
<Dock v-model="activeKey" :items="items" position="left" />
```

### Route-Synced Active State

Keep `syncActiveFromRoute` enabled when dock items map directly to router destinations.

```vue
<Dock
    :items="[
        { key: 'dashboard', label: 'Dashboard', icon: 'house', to: '/dashboard', exact: true },
        { key: 'projects', label: 'Projects', icon: 'folder', to: '/projects' },
        { key: 'settings', label: 'Settings', icon: 'gear', to: '/settings' },
    ]"
/>
```

### Custom Item Template

Use the `item` slot when the launcher needs badges, counters, or richer branding.

```vue
<Dock :items="items">
    <template #item="{ item, active }">
        <span :class="['dock-item', { 'dock-item_active': active }]">
            <Icon :icon="item.icon" />
            <Badge v-if="item.key === 'search'" value="3" />
            <span>{{ item.label }}</span>
        </span>
    </template>
</Dock>
```

## API

### Types

```ts
type DockKey = string | number;

interface DockItem {
    key?: DockKey;
    label: string;
    icon?: string;
    to?: string | RouteLocationRaw;
    href?: string;
    url?: string;
    active?: boolean;
    exact?: boolean;
    disabled?: boolean;
    command?: () => void;
}
```

### Props

| Name                  | Type                                     | Default                  |
| --------------------- | ---------------------------------------- | ------------------------ |
| `items`               | `DockItem[]`                             | `[]`                     |
| `modelValue`          | `string \| number \| null`               | `null`                   |
| `position`            | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'`               |
| `disabled`            | `boolean`                                | `false`                  |
| `ariaLabel`           | `string`                                 | `'Application launcher'` |
| `syncActiveFromRoute` | `boolean`                                | `true`                   |
| `pt`                  | `PassThroughOptions \| undefined`        | `undefined`              |
| `unstyled`            | `boolean`                                | `false`                  |

### Events

| Name                | Payload                       |
| ------------------- | ----------------------------- |
| `update:modelValue` | `DockKey`                     |
| `select`            | `{ item, index, key, event }` |

### Slots

| Name   | Description                                          |
| ------ | ---------------------------------------------------- |
| `item` | Custom launcher item with `{ item, index, active }`. |

## Theming

Override component tokens through `theme.overrides.components.dock`.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `shadow`
- Layout: `padding`, `gap`
- Items: `itemSize`, `itemBorderRadius`, `itemColor`, `itemHoverBackgroundColor`, `itemActiveBackgroundColor`, `itemActiveColor`
- Icon and label: `iconSize`, `labelFontSize`
- State: `disabledOpacity`

## Recipes

- Use Dock for desktop-style app launchers, workspace switchers, and utility rails.
- Prefer `BottomNavigation` for mobile primary navigation where app-shell semantics are simpler and labels are always visible.

## Accessibility

- Dock renders a `nav` landmark with `menubar` and `menuitem` roles.
- Keyboard support includes roving focus with arrow keys, `Home`, `End`, and activation with `Enter` or `Space`.
- Active route or selected item is exposed via `aria-current="page"` when applicable.
