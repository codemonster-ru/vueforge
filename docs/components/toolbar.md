# Toolbar

Arrange grouped action controls in start, center, and end zones.

## Import

```ts
import { Toolbar } from '@codemonster-ru/vueforge';
```

## Examples

Use `Toolbar` for local action grouping inside pages, cards, and data regions.

### Basic

Use the three-zone layout for standard page actions.

```vue
<template>
    <Toolbar aria-label="Data table controls">
        <template #start>
            <Button size="small">Create</Button>
            <Button size="small" variant="outlined">Import</Button>
        </template>
        <template #center>
            <Input placeholder="Search..." />
        </template>
        <template #end>
            <Button size="small" variant="text">Refresh</Button>
            <Button size="small">Export</Button>
        </template>
    </Toolbar>
</template>
```

### Default Single Group

Use the default slot when the toolbar only needs one group.

```vue
<template>
    <Toolbar>
        <Button size="small">Save</Button>
        <Button size="small" variant="outlined">Discard</Button>
    </Toolbar>
</template>
```

### Vertical

Switch to vertical orientation for narrow side panels or stacked action groups.

```vue
<template>
    <Toolbar orientation="vertical" :wrap="false">
        <template #start>
            <Button size="small">Apply</Button>
        </template>
        <template #end>
            <Button size="small" variant="outlined">Reset</Button>
        </template>
    </Toolbar>
</template>
```

### Dense

Use `dense` in card headers or compact admin panels.

```vue
<template>
    <Toolbar dense>
        <Button size="small" variant="text">Refresh</Button>
        <Button size="small" variant="text">Share</Button>
    </Toolbar>
</template>
```

## Props

- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `wrap?: boolean` (default `true`)
- `dense?: boolean` (default `false`)
- `ariaLabel?: string` (default `Toolbar`)
- `groupAriaLabel?: string` (default `Toolbar group`)
- `startAriaLabel?: string` (default `Toolbar start group`)
- `centerAriaLabel?: string` (default `Toolbar center group`)
- `endAriaLabel?: string` (default `Toolbar end group`)

## Events

- This component does not emit component-specific events.

## Slots

- `default`
- `start`
- `center`
- `end`

## Theming

- Override via `theme.overrides.components.toolbar`.

## Tokens

Component tokens (override via `theme.overrides.components.toolbar`):

- `padding`, `densePadding`
- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `sectionGap`, `controlGap`

## Recipes

- Use `Toolbar` for local controls; use `AppBar` for shell-level chrome.
- Keep related controls together in one section so keyboard grouping remains meaningful.
- Disable wrapping only when you are confident the toolbar width is predictable.

## Accessibility

- Root uses `role="toolbar"` with a configurable label.
- Named sections render with `role="group"` to express grouped controls.
