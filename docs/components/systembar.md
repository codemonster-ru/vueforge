# SystemBar

Render a compact status or utility strip above the main application chrome.

## Import

```ts
import { SystemBar } from '@codemonster-ru/vueforge';
```

## Examples

Use `SystemBar` for environment, tenant, status, or maintenance context that should remain visible but secondary to the main app bar.

### Basic

Use start, center, and end regions for compact operational context.

```vue
<template>
    <SystemBar sticky>
        <template #start>
            Production
        </template>
        <template #center>
            EU-Central · 99.98% uptime
        </template>
        <template #end>
            <Button size="small" variant="text">Status</Button>
        </template>
    </SystemBar>
</template>
```

### Dense

Use `dense` when the bar contains short status tokens and needs to stay unobtrusive.

```vue
<template>
    <SystemBar dense>
        <template #center>
            Maintenance window tonight 23:00-23:30 UTC
        </template>
    </SystemBar>
</template>
```

### Fixed

Use `fixed` when the strip should remain pinned above the shell during scroll.

```vue
<template>
    <SystemBar fixed :z-index="210">
        <template #start>Sandbox</template>
    </SystemBar>
</template>
```

## Props

- `as?: string` (default `div`)
- `fixed?: boolean` (default `false`)
- `sticky?: boolean` (default `false`)
- `dense?: boolean` (default `false`)
- `bordered?: boolean` (default `true`)
- `ariaLabel?: string` (default `System bar`)
- `startAriaLabel?: string` (default `System status`)
- `centerAriaLabel?: string` (default `System bar content`)
- `endAriaLabel?: string` (default `System actions`)
- `zIndex?: string | number`

## Events

- This component does not emit component-specific events.

## Slots

- `start`
- `center`
- `default`
- `end`

## Theming

- Override via `theme.overrides.components.systemBar`.

## Tokens

Component tokens (override via `theme.overrides.components.systemBar`):

- `height`, `denseHeight`
- `padding`, `densePadding`
- `gap`, `sectionGap`
- `borderColor`, `backgroundColor`, `textColor`
- `zIndex`

## Recipes

- Pair `SystemBar` with `AppBar` when system-level context should be visually separate from navigation and actions.
- Keep content concise; this strip should not become a second toolbar.
- Use `dense` for mostly textual or badge-like status indicators.

## Accessibility

- Uses `region` semantics unless rendered as a semantic `header`.
- Provide meaningful section labels when grouped content is not obvious from visible text.
