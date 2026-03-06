# EmptyState

Present no-data and no-results scenarios with clear explanation and next actions.

## Import

```ts
import { EmptyState } from '@codemonster-ru/vueforge';
```

## Examples

Use `EmptyState` when the user needs orientation and a next step, not just a plain "no results" string.

### Basic

Use title and description props for straightforward empty scenarios.

```vue
<template>
    <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        icon="folder"
    />
</template>
```

### With Actions

Use the `actions` slot when the user can recover immediately from the empty condition.

```vue
<template>
    <EmptyState title="No projects yet" description="Create your first project to get started.">
        <template #actions>
            <Button label="Create project" size="small" />
            <Button label="Import" size="small" variant="outline" />
        </template>
    </EmptyState>
</template>
```

### Outlined Variant

Use `outlined` when the empty state sits on a busy surface and should feel lighter.

```vue
<template>
    <EmptyState
        variant="outlined"
        title="No matching environments"
        description="Try adjusting the selected filters."
    />
</template>
```

### Sizes

Adjust size for compact panels or larger dashboard canvases.

```vue
<template>
    <Stack gap="1rem">
        <EmptyState size="small" title="No notes" description="Add a note to get started." />
        <EmptyState title="No data" description="Pick a date range to load metrics." />
        <EmptyState size="large" title="No dashboards" description="Create your first dashboard." />
    </Stack>
</template>
```

## Props

- `title?: string`
- `description?: string`
- `icon?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - description content (fallbacks to `description`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)

## Theming

- Override via `theme.overrides.components.emptyState`.

## Tokens

Component tokens (override via `theme.overrides.components.emptyState`):

- `gap`, `bodyGap`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `maxWidth`
- `iconSize`, `iconColor`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`, `titleColor`
- `descriptionFontSize`, `descriptionLineHeight`, `descriptionColor`
- `actionsGap`
- `small.padding`, `small.iconSize`, `small.titleFontSize`, `small.descriptionFontSize`
- `large.padding`, `large.iconSize`, `large.titleFontSize`, `large.descriptionFontSize`

## Recipes

- Use empty states to explain why content is missing and what the user can do next.
- Prefer explicit next actions over passive copy when a recovery path exists.
- Keep icon choice supportive, not decorative noise.

## Accessibility

- Empty state renders `role="status"` with polite announcement behavior.
- Ensure actions remain keyboard reachable and text stays descriptive without relying on icons.
