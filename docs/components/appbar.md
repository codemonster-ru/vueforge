# AppBar

Provide a top-level application bar for global navigation, branding, and primary actions.

## Import

```ts
import { AppBar } from '@codemonster-ru/vueforge-layouts';
```

## Examples

Use `AppBar` as shell-level chrome rather than a local card or section header.

### Basic

Use `start`, title, and `actions` regions for a standard workspace header.

```vue
<template>
    <AppBar title="Operations">
        <template #start>
            <Button size="small" variant="text">Menu</Button>
        </template>
        <template #actions>
            <Button size="small" variant="outlined">Invite</Button>
            <Button size="small">Create</Button>
        </template>
    </AppBar>
</template>
```

### Custom Title Region

Use the `title` slot when the center area needs richer content than plain text.

```vue
<template>
    <AppBar>
        <template #title>
            <Inline align="center" gap="0.5rem">
                <strong>Workspace</strong>
                <Badge severity="info">Beta</Badge>
            </Inline>
        </template>
    </AppBar>
</template>
```

### Dense

Use `dense` when the shell already has another persistent status or navigation row.

```vue
<template>
    <AppBar title="Deployments" dense />
</template>
```

### Fixed

Use `fixed` for app-level chrome that should remain pinned above scrollable content.

```vue
<template>
    <AppBar title="Admin console" fixed :z-index="200" />
</template>
```

## Props

- `as?: string` (default `header`)
- `title?: string`
- `fixed?: boolean` (default `false`)
- `sticky?: boolean` (default `true`; ignored when `fixed=true`)
- `dense?: boolean` (default `false`)
- `mobileBreakpoint?: number` (default `768`)
- `collapseActionsOnMobile?: boolean` (default `true`)
- `height?: string`
- `denseHeight?: string`
- `zIndex?: string | number`
- `ariaLabel?: string`
- `actionsAriaLabel?: string` (default `App bar actions`)

## Events

- This component does not emit component-specific events.

## Slots

- `start`
- `title`
- `default`
- `actions`

## Theming

- Override via `theme.overrides.components.appBar`.

## Tokens

Component tokens (override via `theme.overrides.components.appBar`):

- `height`, `denseHeight`
- `padding`, `densePadding`, `mobilePadding`
- `gap`, `actionsGap`
- `borderColor`, `backgroundColor`, `textColor`
- `zIndex`

## Recipes

- Keep `AppBar` focused on global context and actions, not page-specific form controls.
- Use `dense` when stacking it with `SystemBar` or another persistent shell row.
- Prefer `Toolbar` inside page content when the actions are local to one screen section.

## Accessibility

- Prefer semantic `header` usage for top-level application landmarks.
- Provide `actionsAriaLabel` when the trailing action cluster needs explicit narration.
