# TabMenu

Render route-aware section navigation with tab semantics.

## Import

```ts
import { TabMenu } from '@codemonster-ru/vueforge';
```

## Examples

Use `TabMenu` when major subsections of one screen should behave like tabs but can still map to routes.

### Basic

Use it for dashboard or settings subsections.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const activeSection = ref('overview');
</script>

<template>
    <TabMenu
        v-model="activeSection"
        :items="[
            { label: 'Overview', value: 'overview' },
            { label: 'Usage', value: 'usage' },
            { label: 'Billing', value: 'billing' },
        ]"
    />
</template>
```

### Route-Aware Tabs

Use route links when each section should have its own URL.

```vue
<template>
    <TabMenu
        :items="[
            { label: 'Overview', to: '/account/overview' },
            { label: 'Usage', to: '/account/usage' },
            { label: 'Billing', to: '/account/billing' },
        ]"
    />
</template>
```

### Disabled Tab

Keep future or unavailable sections visible but disabled.

```vue
<template>
    <TabMenu
        model-value="general"
        :items="[
            { label: 'General', value: 'general' },
            { label: 'Permissions', value: 'permissions', disabled: true },
        ]"
    />
</template>
```

## Props

- `modelValue?: string | number | null`
- `items?: Array<{ label: string; value?: string | number; to?: RouteLocationRaw; href?: string; url?: string; disabled?: boolean }>`
- `syncActiveFromRoute?: boolean` (default `true`)
- `ariaLabel?: string` (default `Tab menu`)

## Events

- `update:modelValue`
- `change`
- `active`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.tabMenu`.

## Tokens

Component tokens (override via `theme.overrides.components.tabMenu`):

- `gap`, `borderWidth`, `borderColor`
- `tabPadding`, `tabBorderRadius`
- `tabTextColor`, `tabHoverTextColor`, `tabHoverBackgroundColor`
- `tabActiveTextColor`, `tabActiveBorderColor`
- `disabledOpacity`

## Recipes

- Use `TabMenu` for top-level section switching inside one product area, not for deep nested trees.
- Prefer route syncing when each tab should be addressable via URL.
- Keep tab labels short so the control remains scannable.

## Accessibility

- Uses `tablist` and `tab` semantics.
- Keyboard support includes `ArrowLeft`, `ArrowRight`, `Home`, and `End`.
- Active state is exposed via `aria-selected`.
