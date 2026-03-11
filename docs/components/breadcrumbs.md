# Breadcrumbs

Expose hierarchical navigation context for pages nested inside multi-level product flows.

## Import

```ts
import { Breadcrumbs } from '@codemonster-ru/vueforge-layouts';
```

## Examples

Use `Breadcrumbs` for route hierarchy, not for arbitrary metadata. The last item should represent the current page.

### Basic

Use a simple breadcrumb trail for standard application hierarchy.

```vue
<template>
    <Breadcrumbs
        :items="[
            { label: 'Home', to: '/' },
            { label: 'Settings', to: '/settings' },
            { label: 'Profile', active: true },
        ]"
    />
</template>
```

### Implicit Current Item

When no explicit `active` item is set, the last item is treated as the current page automatically.

```vue
<template>
    <Breadcrumbs
        :items="[
            { label: 'Projects', to: '/projects' },
            { label: 'Project Apollo', to: '/projects/apollo' },
            { label: 'Members' },
        ]"
    />
</template>
```

### Custom Separator

Use the `separator` slot when the product needs icon-style separators instead of text.

```vue
<template>
    <Breadcrumbs
        :items="[
            { label: 'Home', to: '/' },
            { label: 'Reports', to: '/reports' },
            { label: 'Revenue', active: true },
        ]"
    >
        <template #separator>
            <span>&rsaquo;</span>
        </template>
    </Breadcrumbs>
</template>
```

### Custom Item Slot

Use the `item` slot when breadcrumb items need richer markup while keeping current-page logic intact.

```vue
<template>
    <Breadcrumbs
        :items="[
            { label: 'Workspace', to: '/workspace' },
            { label: 'Security', active: true },
        ]"
    >
        <template #item="{ item, active }">
            <span :style="{ fontWeight: active ? '600' : '400' }">{{ item.label }}</span>
        </template>
    </Breadcrumbs>
</template>
```

## Props

- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; active?: boolean; disabled?: boolean }>`
- `separator?: string` (default `/`)
- `ariaLabel?: string` (default `Breadcrumbs`)

## Events

- This component does not emit component-specific events.

## Slots

- `item` - slot props: `{ item, index, isLast, active }`
- `separator` (optional) - slot props: `{ separator }`

## Theming

- Override via `theme.overrides.components.breadcrumbs`.

## Tokens

Component tokens (override via `theme.overrides.components.breadcrumbs`):

- `gap`, `fontSize`, `textColor`, `hoverColor`, `activeColor`
- `separatorColor`, `disabledOpacity`

## Recipes

- Keep breadcrumb depth short; long trails usually signal an information architecture problem.
- Use explicit `active` only when the current item is not the last entry in the array.
- Prefer route labels users already recognize from navigation, not internal entity IDs or technical names.

## Accessibility

- Breadcrumbs root uses semantic `nav` with `aria-label` (default `Breadcrumbs`).
- Current item is rendered with `aria-current="page"` and should be a non-link label.
- Use descriptive labels and keep hierarchy short (typically 2-4 levels).
- Preserve separator readability when providing custom separator content.
