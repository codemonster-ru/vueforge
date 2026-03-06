# Divider

Separate adjacent content groups with consistent horizontal or vertical visual rhythm.

## Import

```ts
import { Divider } from '@codemonster-ru/vueforge';
```

## Examples

Use `Divider` to clarify grouping, not as decoration for its own sake.

### Basic

Use a horizontal divider between stacked sections.

```vue
<template>
    <Stack gap="1rem">
        <p>Current plan: Pro</p>
        <Divider />
        <p>Billing cycle: Monthly</p>
    </Stack>
</template>
```

### With Label

Use a label when the separator marks an explicit branch in the flow.

```vue
<template>
    <Divider label="OR" />
</template>
```

### Vertical

Use a vertical divider inside inline toolbars or compact metadata rows.

```vue
<template>
    <div style="height: 32px; display: flex; align-items: center; gap: 8px">
        <span>Overview</span>
        <Divider orientation="vertical" />
        <span>Usage</span>
        <Divider orientation="vertical" />
        <span>Audit log</span>
    </div>
</template>
```

### Variants And Inset

Adjust the line style or inset when the surrounding surface calls for lighter separation.

```vue
<template>
    <Stack gap="0.75rem">
        <Divider variant="solid" />
        <Divider variant="dashed" inset />
        <Divider variant="dotted" />
    </Stack>
</template>
```

## Props

- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `variant?: 'solid' | 'dashed' | 'dotted'` (default `solid`)
- `inset?: boolean` (default `false`)
- `label?: string`
- `ariaLabel?: string` (default `Divider`)

## Events

- This component does not emit component-specific events.

## Slots

- `default` - custom label content in horizontal mode

## Theming

- Override via `theme.overrides.components.divider`.

## Tokens

Component tokens (override via `theme.overrides.components.divider`):

- `color`, `textColor`, `thickness`, `minLength`
- `gap`, `inset`
- `labelPadding`, `labelFontSize`

## Recipes

- Use vertical dividers sparingly and only when adjacent content is clearly related.
- Labelled dividers work well in auth or branch-choice flows.
- Prefer spacing alone when the separation is already obvious.

## Accessibility

- Renders with `role="separator"` and exposes orientation semantics.
- Keep labels concise when using labelled dividers.
