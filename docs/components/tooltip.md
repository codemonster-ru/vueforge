# Tooltip

Show concise supplemental help on hover or focus without adding persistent UI chrome.

## Import

```ts
import { Tooltip } from '@codemonster-ru/vueforge';
```

## Examples

Use `Tooltip` only for short supplemental content. It should never carry the only explanation for a critical action.

### Basic

Use a text tooltip for compact helper hints.

```vue
<template>
    <Tooltip text="Helpful hint">
        <Button label="Hover me" />
    </Tooltip>
</template>
```

### Arrow

Enable `arrow` when the pointer-to-content relationship should be visually explicit.

```vue
<template>
    <Tooltip text="This action refreshes analytics data" arrow>
        <Button label="Refresh" variant="outlined" />
    </Tooltip>
</template>
```

### Custom Content Slot

Use the `content` slot for short formatted tooltip content.

```vue
<template>
    <Tooltip arrow>
        <Button label="Info" />
        <template #content>
            <span>Available to workspace admins only.</span>
        </template>
    </Tooltip>
</template>
```

### Delays

Tune delays in dense interfaces where immediate hover popups would become noisy.

```vue
<template>
    <Tooltip text="Appears with delay" :show-delay="250" :hide-delay="150">
        <Button label="Delayed tooltip" />
    </Tooltip>
</template>
```

## Props

- `text?: string`
- `placement?: 'top' | 'bottom' | 'left' | 'right'` (default `top`)
- `disabled?: boolean`
- `arrow?: boolean` (default `false`)
- `showDelay?: number` (default `0`)
- `hideDelay?: number` (default `0`)
- `closeOnEsc?: boolean` (default `true`)

## Events

- No emitted events.

## Slots

- `default` - trigger content
- `content` (optional) - tooltip content (fallbacks to `text`)

## Theming

- Override via `theme.overrides.components.tooltip`.

## Tokens

Component tokens (override via `theme.overrides.components.tooltip`):

- `padding`, `borderRadius`, `backgroundColor`, `textColor`
- `fontSize`, `lineHeight`, `shadow`, `zIndex`, `maxWidth`, `arrowSize`

## Recipes

- Use tooltips for short help copy, not for workflow-critical information.
- Keep the trigger itself meaningful without the tooltip; keyboard and touch users may never rely on hover.
- Prefer `Popover` when the content includes actions or multiple lines of structured explanation.

## Accessibility

- Tooltip content should supplement, not replace, visible label text.
- Ensure trigger remains keyboard-focusable for non-pointer users.
- Use concise helper text to avoid excessive announcement noise.
