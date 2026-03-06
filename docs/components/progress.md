# Progress

Visualize determinate or indeterminate task progress in linear or circular form.

## Import

```ts
import { Progress } from '@codemonster-ru/vueforge';
```

## Examples

Use `Progress` when the system can communicate advancement or ongoing work more clearly than a generic spinner.

### Linear

Use linear progress for page sections, uploads, and background jobs.

```vue
<template>
    <Progress :value="64" />
</template>
```

### Circular

Use circular progress for compact status widgets and cards.

```vue
<template>
    <Progress variant="circular" :value="42" size="small" />
</template>
```

### With Value Label

Use `showValue` when the numeric percentage helps users judge remaining time or completion.

```vue
<template>
    <Progress severity="success" showValue :value="85" />
</template>
```

### Indeterminate

Omit `value` when the work is ongoing but total progress is unknown.

```vue
<template>
    <Progress />
</template>
```

## Props

- `value?: number` (0-100; omit for indeterminate)
- `variant?: 'linear' | 'circular'` (default `linear`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `label?: string`
- `showValue?: boolean` (default `false`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `ariaLabel?: string`

## Events

- This component does not emit component-specific events.

## Slots

- `default` - overrides the visible label content

## Theming

- Override via `theme.overrides.components.progress`.

## Tokens

Component tokens (override via `theme.overrides.components.progress`):

- `width`, `height`, `borderRadius`
- `backgroundColor`, `barColor`
- `labelColor`, `labelFontSize`, `gap`
- `circularSize`, `circularThickness`
- `animationDuration`
- `info.barColor`, `success.barColor`, `warn.barColor`, `danger.barColor`
- `small.height`, `small.labelFontSize`, `small.circularSize`, `small.circularThickness`
- `large.height`, `large.labelFontSize`, `large.circularSize`, `large.circularThickness`

## Recipes

- Use determinate progress whenever you can calculate advancement; indeterminate should be the fallback.
- Prefer linear progress for wide layouts and circular progress for compact summaries.
- Use visible labels only when they add actual decision value.

## Accessibility

- Progress renders `role="progressbar"` with `aria-valuenow` omitted in indeterminate mode.
- Provide `ariaLabel` when the surrounding context does not already explain what is progressing.
