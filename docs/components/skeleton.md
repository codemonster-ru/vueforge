# Skeleton

Render loading placeholders that preserve layout while real content is still unavailable.

## Import

```ts
import { Skeleton } from '@codemonster-ru/vueforge';
```

## Examples

Use `Skeleton` to mirror the shape of the final UI, not as a generic decorative shimmer.

### Basic

Use inline dimensions for simple placeholders.

```vue
<template>
    <Stack gap="0.5rem">
        <Skeleton width="240px" height="14px" />
        <Skeleton width="180px" height="14px" />
        <Skeleton variant="circle" :width="48" />
    </Stack>
</template>
```

### Table Preset

Use the table preset to keep grid-heavy layouts stable during loading.

```vue
<template>
    <Skeleton preset="table" :table-rows="5" :table-columns="4" />
</template>
```

### List Preset

Use the list preset for feed, comment, and card-list loading states.

```vue
<template>
    <Skeleton preset="list" :list-rows="6" />
</template>
```

### Form Preset

Use the form preset when a detail or edit screen is loading.

```vue
<template>
    <Skeleton preset="form" :form-rows="4" />
</template>
```

## Props

- `width?: string | number`
- `height?: string | number`
- `variant?: 'text' | 'rect' | 'circle'` (default `text`)
- `animated?: boolean` (default `true`)
- `preset?: 'none' | 'table' | 'list' | 'form'` (default `none`)
- `tableRows?: number` (default `4`)
- `tableColumns?: number` (default `4`)
- `listRows?: number` (default `4`)
- `formRows?: number` (default `4`)

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.skeleton`.

## Tokens

Component tokens (override via `theme.overrides.components.skeleton`):

- `width`, `height`, `lineHeight`, `borderRadius`
- `backgroundColor`, `shimmerColor`, `animationDuration`
- `presetGap`
- `presetTableHeaderHeight`, `presetTableRowHeight`
- `presetListAvatarSize`, `presetListLineHeight`, `presetListSecondaryWidth`
- `presetFormLabelWidth`, `presetFormLabelHeight`, `presetFormFieldHeight`

## Recipes

- Use `preset="table"` for data grids, `preset="list"` for feed or card lists, and `preset="form"` for edit views.
- Match placeholder density to the final screen so the transition feels credible.
- Disable animation only when the product deliberately wants a static loading state.

## Accessibility

- Skeletons are `aria-hidden` placeholders and should not be treated as meaningful content.
- Pair them with surrounding loading semantics when the parent region needs an announced busy state.
